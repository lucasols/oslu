import { test, expect } from 'vitest'
import { jsonFormatter } from '../src/utils/jsonFormatter'

test('short array', () => {
  expect(
    jsonFormatter([1, 2, true, false, 'string', 'teste']),
  ).toMatchInlineSnapshot("\"[ 1, 2, true, false, 'string', 'teste' ]\"")
})

test('long array', () => {
  expect(
    jsonFormatter([
      1,
      2,
      true,
      false,
      'string',
      'teste',
      'sdfsdf',
      'sdfsdf sdf',
      'sdfsdf sdf',
      'dsfsdfsdf',
      'sdfsdfsdfsdf',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
    ]),
  ).toMatchInlineSnapshot(`
    "[
      1,
      2,
      true,
      false,
      'string',
      'teste',
      'sdfsdf',
      'sdfsdf sdf',
      'sdfsdf sdf',
      'dsfsdfsdf',
      'sdfsdfsdfsdf',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
    ]"
  `)
})

test('very long array', () => {
  expect(
    jsonFormatter([
      1,
      2,
      true,
      false,
      'string',
      'teste',
      'sdfsdf',
      'sdfsdf sdf',
      'sdfsdf sdf',
      'dsfsdfsdf',
      'sdfsdfsdfsdf',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
    ]),
  ).toMatchInlineSnapshot(`
    "[
      1,
      2,
      true,
      false,
      'string',
      'teste',
      'sdfsdf',
      'sdfsdf sdf',
      'sdfsdf sdf',
      'dsfsdfsdf',
      'sdfsdfsdfsdf',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      'sdfsdfsdfsdfs',
      ... +16 items
    ]"
  `)
})

test('small obj', () => {
  expect(jsonFormatter({ a: 1 })).toMatchInlineSnapshot('"{ a: 1 }"')
})

test('small obj 2', () => {
  expect(jsonFormatter({ a: 1, b: 2 })).toMatchInlineSnapshot(
    '"{ a: 1, b: 2 }"',
  )
})

test('small obj 2, with nested items', () => {
  expect(jsonFormatter({ a: 1, b: 2, c: { a: 'ok' } })).toMatchInlineSnapshot(
    '"{ a: 1, b: 2, c: { a: \'ok\' } }"',
  )
})

test('large obj', () => {
  expect(
    jsonFormatter({
      a: 1,
      b: 2,
      c: 'ljlkjl',
      d: 'lkjljljlkjlkjlkl',
      e: 'lkjlkjljlj',
      f: 'lkjlkjljlj',
      g: 'lkjlkjljlj kjsdflksdlfj sdflksjd flsldjflk sdflk jsldfl jlksdfksd',
      h: 'lkjlkjljlj kjsdflksdlfj',
    }),
  ).toMatchInlineSnapshot(`
    "{
      a: 1,
      b: 2,
      c: 'ljlkjl',
      d: 'lkjljljlkjlkjlkl',
      e: 'lkjlkjljlj',
      f: 'lkjlkjljlj',
      g: 'lkjlkjljlj kjsdflksdlfj sdflksjd flsldjflk sdflk jsldfl jlksdfksd',
      h: 'lkjlkjljlj kjsdflksdlfj',
    }"
  `)
})

test('large obj with nested items', () => {
  expect(
    jsonFormatter({
      a: 1,
      b: 2,
      c: 'ljlkjl',
      d: 'lkjljljlkjlkjlkl',
      e: 'lkjlkjljlj',
      f: 'lkjlkjljlj',
      g: 'lkjlkjljlj kjsdflksdlfj sdflksjd flsldjflk sdflk jsldfl jlksdfksd',
      h: 'lkjlkjljlj kjsdflksdlfj',
      i: { a: 1, b: 2, c: 'ljlkjl', d: 'lkjljljlkjlkjlkl' },
    }),
  ).toMatchInlineSnapshot(`
    "{
      a: 1,
      b: 2,
      c: 'ljlkjl',
      d: 'lkjljljlkjlkjlkl',
      e: 'lkjlkjljlj',
      f: 'lkjlkjljlj',
      g: 'lkjlkjljlj kjsdflksdlfj sdflksjd flsldjflk sdflk jsldfl jlksdfksd',
      h: 'lkjlkjljlj kjsdflksdlfj',
      i: { a: 1, b: 2, c: 'ljlkjl', d: 'lkjljljlkjlkjlkl' },
    }"
  `)
})

test('large obj with very large nested items', () => {
  expect(
    jsonFormatter({
      a: 1,
      b: 2,
      c: 'ljlkjl',
      d: 'lkjljljlkjlkjlkl',
      e: 'lkjlkjljlj',
      f: 'lkjlkjljlj',
      g: 'lkjlkjljlj kjsdflksdlfj sdflksjd flsldjflk sdflk jsldfl jlksdfksd',
      h: 'lkjlkjljlj kjsdflksdlfj',
      i: {
        a: 1,
        b: 2,
        c: 'ljlkjl',
        d: 'lkjljljlkjlkjlkl sdlfkjsdjf lsdlfjldsjlfk lksdkfjsdjfljsdflkj dlsfjklsdjflj',
        e: 'lkjlkjljlj',
        f: 'sdfsf',
        j: {
          a: 1,
          b: 2,
          c: 'ljlkjl',
        },
      },
    }),
  ).toMatchInlineSnapshot(`
    "{
      a: 1,
      b: 2,
      c: 'ljlkjl',
      d: 'lkjljljlkjlkjlkl',
      e: 'lkjlkjljlj',
      f: 'lkjlkjljlj',
      g: 'lkjlkjljlj kjsdflksdlfj sdflksjd flsldjflk sdflk jsldfl jlksdfksd',
      h: 'lkjlkjljlj kjsdflksdlfj',
      i: {
        a: 1,
        b: 2,
        c: 'ljlkjl',
        d: 'lkjljljlkjlkjlkl sdlfkjsdjf lsdlfjldsjlfk lksdkfjsdjfljsdflkj dlsfjklsdjflj',
        e: 'lkjlkjljlj',
        f: 'sdfsf',
        j: { a: 1, b: 2, c: 'ljlkjl' },
      },
    }"
  `)
})

test('very large obj', () => {
  expect(
    jsonFormatter({
      a: 1,
      b: 2,
      c: 'ljlkjl',
      d: 'lkjljljlkjlkjlkl',
      e: 'lkjlkjljlj',
      f: 'lkjlkjljlj',
      g: 'lkjlkjljlj kjsdflksdlfj sdflksjd flsldjflk sdflk jsldfl jlksdfksd',
      h: 'lkjlkjljlj kjsdflksdlfj',
      i: 'lkjlkjljlj kjsdflksdlfj',
      j: 'lkjlkjljlj kjsdflksdlfj',
      k: 'lkjlkjljlj kjsdflksdlfj',
      l: 'lkjlkjljlj kjsdflksdlfj',
      m: 'lkjlkjljlj kjsdflksdlfj',
      n: 'lkjlkjljlj kjsdflksdlfj',
      o: 'lkjlkjljlj kjsdflksdlfj',
    }),
  ).toMatchInlineSnapshot(`
    "{
      a: 1,
      b: 2,
      c: 'ljlkjl',
      d: 'lkjljljlkjlkjlkl',
      e: 'lkjlkjljlj',
      f: 'lkjlkjljlj',
      g: 'lkjlkjljlj kjsdflksdlfj sdflksjd flsldjflk sdflk jsldfl jlksdfksd',
      h: 'lkjlkjljlj kjsdflksdlfj',
      i: 'lkjlkjljlj kjsdflksdlfj',
      j: 'lkjlkjljlj kjsdflksdlfj',
      ... +5 properties
    }"
  `)
})

test('masNestedDepth obj', () => {
  expect(
    jsonFormatter({
      a: 1,
      b: {
        c: {
          d: {
            e: {
              f: {
                g: 1,
              },
            },
          },
        },
      },
    }),
  ).toMatchInlineSnapshot('"{ a: 1, b: { c: { d: { e: {...} } } } }"')
})

test('masNestedDepth array', () => {
  expect(jsonFormatter([1, [[[[[[1]]]]]]])).toMatchInlineSnapshot(
    '"[ 1, [ [ [ [...] ] ] ] ]"',
  )
})

test('respect maxLenght', () => {
  const obj = { a: 1, b: 2, f: { c: 'ljlkjl sdlfkjsd dsfsdf sdfsdf sdfsdfsd' } }

  expect(jsonFormatter(obj, { maxLength: 66 })).toMatchInlineSnapshot(
    '"{ a: 1, b: 2, f: { c: \'ljlkjl sdlfkjsd dsfsdf sdfsdf sdfsdfsd\' } }"',
  )

  const ob2 = {
    a: 1,
    b: 2,
    f: { c: 'ljlkjl sdlfkjsd dsfsdf sdfsdf sdfsdfsds' },
  }

  expect(jsonFormatter(ob2, { maxLength: 66 })).toMatchInlineSnapshot(`
    "{
      a: 1,
      b: 2,
      f: { c: 'ljlkjl sdlfkjsd dsfsdf sdfsdf sdfsdfsds' },
    }"
  `)

  const subObj = {
    c: 'ljlkjl sdlfkjsd dsfsdf ksdfkw lkoikh',
    d: 'sdfsdf',
    e: 'sdfsdf sdfd',
  }

  expect(jsonFormatter(subObj, { maxLength: 80 - 4 })).toMatchInlineSnapshot(
    "\"{ c: 'ljlkjl sdlfkjsd dsfsdf ksdfkw lkoikh', d: 'sdfsdf', e: 'sdfsdf sdfd' }\"",
  )

  expect(
    jsonFormatter(
      {
        a: 1,
        b: 2,
        f: subObj,
      },
      { maxLength: 80 - 4 },
    ),
  ).toMatchInlineSnapshot(`
    "{
      a: 1,
      b: 2,
      f: {
        c: 'ljlkjl sdlfkjsd dsfsdf ksdfkw lkoikh',
        d: 'sdfsdf',
        e: 'sdfsdf sdfd',
      },
    }"
  `)
})

test('different valu tyeps', () => {
  expect(
    jsonFormatter(
      {
        a: 1,
        b: '2',
        c: true,
        d: null,
        e: undefined,
        regex: /abc/,
        date: new Date('2023-02-08T02:43:21.874Z'),
        error: new Error('abc'),
        emptyArray: [],
        emptyObj: {},
      },
      {
        maxLength: 50,
      },
    ),
  ).toMatchInlineSnapshot(`
    "{
      a: 1,
      b: '2',
      c: true,
      d: null,
      e: undefined,
      regex: RegExp(/abc/),
      date: Date(2023-02-08T02:43:21.874Z),
      error: Error('abc'),
      emptyArray: [],
      emptyObj: {},
    }"
  `)
})

test('real large obj', () => {
  expect(
    jsonFormatter({
      path: 'v3/conversations/3:mark-as-read',
      payload: {
        meta_id: 'gvqpibaQTRgXrMllEWvY3',
      },
      response: {
        status: true,
        data: {
          id_jestor_chat_users: 3,
          id_chat: 2,
          id_user: 1,
          muted: false,
          joined: true,
          starred: true,
          created_at: '2022-11-11T15:18:15+00:00',
          last_message_at: '2023-02-08T02:46:06+00:00',
          last_message_seen: 0,
          order: null,
          config: null,
          chat: {
            id_jestor_chats: 2,
            chat_slug: 'tab_3#31',
            chat_type: 'record',
            _record: {
              name: 'sdfasdasd fdsfsdxcv',
              jestor_object_label: '75.91',
              jestor_object_label_field:
                '{"label":"Currency lookup table 2","type":"vlookup","key":"tesfd","item":"field","required":false,"field":"tesfd","auto_fill":"{{sdfsdf.num}}","config":{"connectedField":"sdfsdf","isAliasByField":true,"object":"sdfsdf","field":"num","type":"number","textFormat":null},"format":null}',
              sdfsdf: {
                id_sdfsdf: 116,
                jestor_object_label: 'sdf',
                jestor_object_label_field:
                  '{"label":"short text","type":"string","key":"short_text","item":"field","required":false,"field":"short_text","auto_fill":false}',
              },
            },
            record: {
              name: 'sdfasdasd fdsfsdxcv',
              jestor_object_label: '75.91',
              jestor_object_label_field:
                '{"label":"Currency lookup table 2","type":"vlookup","key":"tesfd","item":"field","required":false,"field":"tesfd","auto_fill":"{{sdfsdf.num}}","config":{"connectedField":"sdfsdf","isAliasByField":true,"object":"sdfsdf","field":"num","type":"number","textFormat":null},"format":null}',
              sdfsdf: {
                id_sdfsdf: 116,
                jestor_object_label: 'sdf',
                jestor_object_label_field:
                  '{"label":"short text","type":"string","key":"short_text","item":"field","required":false,"field":"short_text","auto_fill":false}',
              },
            },
          },
          unread_count: 0,
          mention_count: 0,
        },
        metadata: {
          response: 'ok',
          message: 'OK',
          notifications: [],
        },
      },
    }),
  ).toMatchInlineSnapshot(`
    "{
      path: 'v3/conversations/3:mark-as-read',
      payload: { meta_id: 'gvqpibaQTRgXrMllEWvY3' },
      response: {
        status: true,
        data: {
          id_jestor_chat_users: 3,
          id_chat: 2,
          id_user: 1,
          muted: false,
          joined: true,
          starred: true,
          created_at: '2022-11-11T15:18:15+00:00',
          last_message_at: '2023-02-08T02:46:06+00:00',
          last_message_seen: 0,
          order: null,
          ... +4 properties
        },
        metadata: { response: 'ok', message: 'OK', notifications: [] },
      },
    }"
  `)
})

test('truncate very long strings', () => {
  expect(
    jsonFormatter(
      {
        a: 'a'.repeat(210),
      },
      { maxNestedStringSize: 100 },
    ),
  ).toMatchInlineSnapshot(`
    "{ a: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa...' }"
  `)
})

test('format Set', () => {
  expect(jsonFormatter(new Set([1, 2, 3]))).toMatchInlineSnapshot(
    '"Set[ 1, 2, 3 ]"',
  )
})

test('format Map', () => {
  expect(
    jsonFormatter(
      new Map([
        ['a', 1],
        ['b', 2],
      ]),
    ),
  ).toMatchInlineSnapshot('"Map{ a: 1, b: 2 }"')
})