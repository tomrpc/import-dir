[![Build Status](https://travis-ci.org/npmstudy/import-dir.svg?branch=master)](https://travis-ci.org/npmstudy/import-dir)
[![npm version](https://badge.fury.io/js/import-dir.svg)](http://badge.fury.io/js/import-dir)

# importDir()

Node helper to `require()` directories. The directory's files are examined,
and each one that can be `require()`'d is `require()`'d and returned as part
of a hash from that file's basename to its exported contents.

## Example

Given this directory structure:

```
dir
+ a.js
+ b.json
+ c.coffee
+ d.txt
```

`importDir('./dir')` will return the equivalent of:

```js
{
  a: require('./dir/a.js'),
  b: require('./dir/b.json')
}
```

If CoffeeScript is registered via `require('coffee-script/register')`,
`c.coffee` will also be returned. Any extension registered with node will work the same way without any additional configuration.

## Installation

```
npm install @tomrpc/import-dir
```


## Usage

Basic usage that examines only directories' immediate files:

```js
const importDir import '@tomrpc/import-dir';

var dir = await importDir('./path/to/dir');
```

You can optionally customize the behavior by passing an extra options object:

```js
var dir = await importDir('./path/to/dir', { recurse: true });
```

## Options

`recurse`: Whether to recursively `require()` subdirectories too.
(`node_modules` within subdirectories will be ignored.)
Default is false.

`filter`: Apply a filter on the filename before require-ing. For example, ignoring files prefixed with `dev` in a production environment:

```js
await importDir('./dir', {
  filter: function (fullPath) {
    return process.env.NODE_ENV !== 'production' && !fullPath.match(/$dev/);
  }
})
```

`mapKey`: Apply a transform to the module base name after require-ing. For example, uppercasing any module names:

```js
await importDir('./dir', {
  mapKey: function (value, baseName) {
    return baseName.toUpperCase();
  }
})
```

`mapValue`: Apply a transform to the value after require-ing. For example, uppercasing any text exported:

```js
await importDir('./dir', {
  mapValue: function (value, baseName) {
    return typeof value === 'string' ? value.toUpperCase() : value;
  }
})
```

`duplicates`: By default, if multiple files share the same basename, only the
highest priority one is `require()`'d and returned. (Priority is determined by
the order of `require.extensions` keys, with directories taking precedence
over files if `recurse` is true.) Specifying this option `require()`'s all
files and returns full filename keys in addition to basename keys.
Default is false.

In the example above, if there were also an `a.json`, the behavior would
be the same by default, but specifying `duplicates: true` would yield:

```js
{
  a: await import('./dir/a.js'),
  'a.js': await import('./dir/a.js'),
  'a.json': await import('./dir/a.json'),
  b: await import('./dir/b.json'),
  'b.json': await import('./dir/b.json')
}
```

`noCache`: Prevent file caching. Could be useful using gulp.watch or other watch requiring refreshed file content Default is false.

```js
await importDir('./dir', { noCache: true })
```

`extensions`: Array of extensions to look for instead of using `require.extensions`.

```js
await importDir('./dir', { extensions: ['.js', '.json'] })
```

## Thanks

many thanks https://github.com/aseemk/requireDir