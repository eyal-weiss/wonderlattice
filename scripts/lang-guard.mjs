// A language file must be data, not a program. Contributed translations are JavaScript
// (so functions can handle plurals and word order), which means one could also carry code.
// This allowlist accepts only what a dictionary needs and rejects everything else before
// the file is ever run:
//
//   Wonderloom.defineLanguage('<code>', { … })     Wonderloom.defineText('<scope>', '<code>', { … })
//
// with plain values inside: strings, numbers, template strings, arrays, objects, and arrow
// functions such as (n) => (n === 1 ? '1 roll' : `${n} rolls`) that use only their own
// parameters, a few string and number methods, and Math.
import * as acorn from 'acorn';

const METHODS = new Set([
  'toLocaleString',
  'toFixed',
  'join',
  'slice',
  'charAt',
  'at',
  'toUpperCase',
  'toLowerCase',
  'toLocaleUpperCase',
  'toLocaleLowerCase',
  'replace',
  'padStart',
  'padEnd',
  'trim',
  'abs',
  'round',
  'floor',
  'ceil',
  'min',
  'max',
]);
const DEFINE = new Set(['defineLanguage', 'defineText']);
const OPERATORS = new Set([
  '===',
  '!==',
  '==',
  '!=',
  '<',
  '<=',
  '>',
  '>=',
  '+',
  '-',
  '*',
  '/',
  '%',
  '&&',
  '||',
  '??',
  '!',
]);

/** Throws an Error naming the first thing a language file may not contain. */
export function checkLanguageSource(source, file = 'language file', code = file.match(/([\w-]+)\.js$/)?.[1]) {
  const ast = acorn.parse(source, { ecmaVersion: 'latest', sourceType: 'script', locations: true });
  const fail = (node, what) => {
    throw new Error(`${file}:${node.loc.start.line}: ${what} is not allowed in a language file`);
  };

  const value = (node, scope) => {
    switch (node.type) {
      case 'Literal':
        return;
      case 'TemplateLiteral':
        return node.expressions.forEach((e) => value(e, scope));
      case 'ArrayExpression':
        return node.elements.forEach((e) => (e ? value(e, scope) : fail(node, 'an array hole')));
      case 'ObjectExpression':
        // Objects only as data: inside a function, one could carry a function under an allowed method name.
        if (scope.has('#function')) fail(node, 'an object inside a function');
        for (const p of node.properties) {
          if (p.type !== 'Property' || p.kind !== 'init' || p.method || p.computed || p.shorthand)
            fail(p, 'this kind of property');
          if ((p.key.name ?? p.key.value) === '__proto__') fail(p, '__proto__');
          value(p.value, scope);
        }
        return;
      case 'ArrowFunctionExpression':
        return arrow(node, scope);
      case 'Identifier':
        if (!scope.has(node.name)) fail(node, `the name "${node.name}"`);
        return;
      case 'ConditionalExpression':
        return [node.test, node.consequent, node.alternate].forEach((e) => value(e, scope));
      case 'BinaryExpression':
      case 'LogicalExpression':
        if (!OPERATORS.has(node.operator)) fail(node, `the operator ${node.operator}`);
        return [node.left, node.right].forEach((e) => value(e, scope));
      case 'UnaryExpression':
        if (!['-', '+', '!'].includes(node.operator)) fail(node, `the operator ${node.operator}`);
        return value(node.argument, scope);
      case 'MemberExpression':
        // Indexing by a number (list[0]) or reading a length; anything else must be a call below.
        // An index held in a variable could be a name such as "constructor", so it is refused.
        if (node.computed) {
          if (node.property.type !== 'Literal' || typeof node.property.value !== 'number')
            fail(node, 'indexing by name');
          return value(node.object, scope);
        }
        if (node.property.name === 'length') return value(node.object, scope);
        return fail(node, `reading .${node.property.name}`);
      case 'CallExpression': {
        const callee = node.callee;
        node.arguments.forEach((a) => value(a, scope));
        if (callee.type === 'Identifier' && scope.get(callee.name) === 'function') return;
        if (callee.type !== 'MemberExpression' || callee.computed || !METHODS.has(callee.property.name))
          fail(node, 'this call');
        if (callee.object.type === 'Identifier' && callee.object.name === 'Math') return;
        return value(callee.object, scope);
      }
      default:
        fail(node, `a ${node.type}`);
    }
  };

  const arrow = (node, outer) => {
    if (node.async || node.generator) fail(node, 'an async function');
    const scope = new Map(outer);
    scope.set('#function', true);
    for (const p of node.params) {
      if (p.type !== 'Identifier') fail(p, 'a parameter pattern');
      scope.set(p.name, 'value');
    }
    if (node.body.type !== 'BlockStatement') return value(node.body, scope);
    // A block body: const declarations (values or helper arrows), then one return.
    node.body.body.forEach((statement, i, all) => {
      if (statement.type === 'ReturnStatement' && i === all.length - 1 && statement.argument)
        return value(statement.argument, scope);
      if (statement.type !== 'VariableDeclaration' || statement.kind !== 'const')
        fail(statement, `a ${statement.type}`);
      for (const d of statement.declarations) {
        if (d.id.type !== 'Identifier' || !d.init) fail(d, 'this declaration');
        value(d.init, scope);
        scope.set(d.id.name, d.init.type === 'ArrowFunctionExpression' ? 'function' : 'value');
      }
    });
  };

  for (const statement of ast.body) {
    const call = statement.type === 'ExpressionStatement' ? statement.expression : null;
    const callee = call?.type === 'CallExpression' ? call.callee : null;
    if (
      !callee ||
      callee.type !== 'MemberExpression' ||
      callee.computed ||
      callee.object.name !== 'Wonderloom' ||
      !DEFINE.has(callee.property.name)
    )
      fail(statement, 'anything but Wonderloom.defineLanguage(…) and Wonderloom.defineText(…)');
    const scope = new Map([
      ['Math', 'value'],
      ['Infinity', 'value'],
    ]);
    // Each file speaks for its own language only: never English, never another file's language.
    const lang = call.arguments[callee.property.name === 'defineLanguage' ? 0 : 1];
    if (lang?.type !== 'Literal' || lang.value !== code || code === 'en')
      fail(statement, `registering a language other than "${code}" (the file's name)`);
    call.arguments.forEach((a, i) => {
      if (i < call.arguments.length - 1 && a.type !== 'Literal') fail(a, 'a computed code or scope');
      value(a, scope);
    });
  }
}
