(function () {
  'use strict';
  var e = {
      277: function (e, n, t) {
        var r = t(751),
          o = t(529),
          a = (t(188), t(641)),
          i = t(393),
          u = {
            __name: 'App',
            setup(e) {
              return (
                (0, a.Gt)('echarts', i),
                (e, n) => {
                  const t = (0, a.g2)('router-view');
                  return (0, a.uX)(), (0, a.CE)('div', null, [(0, a.bF)(t)]);
                }
              );
            },
          };
        const c = u;
        var m = c,
          f = t(220);
        const s = [
            { path: '/', name: 'Root', redirect: '/index' },
            {
              path: '/index',
              name: 'Index',
              component: () => t.e(927).then(t.bind(t, 927)),
              redirect: '/index/fund09',
              children: [
                {
                  path: 'home',
                  name: 'Home',
                  component: () =>
                    Promise.all([t.e(400), t.e(682)]).then(t.bind(t, 682)),
                },
                {
                  path: 'selfHome',
                  name: 'selfHome',
                  component: () =>
                    Promise.all([t.e(400), t.e(420)]).then(t.bind(t, 420)),
                },
                {
                  path: 'fund06',
                  name: 'fund06',
                  component: () =>
                    Promise.all([t.e(400), t.e(986)]).then(t.bind(t, 986)),
                },
                {
                  path: 'fund02',
                  name: 'fund02',
                  component: () =>
                    Promise.all([t.e(400), t.e(744)]).then(t.bind(t, 744)),
                },
                {
                  path: 'fund03',
                  name: 'fund03',
                  component: () =>
                    Promise.all([t.e(400), t.e(300)]).then(t.bind(t, 300)),
                },
                {
                  path: 'fund04',
                  name: 'fund04',
                  component: () => t.e(871).then(t.bind(t, 871)),
                },
                {
                  path: 'fund05',
                  name: 'fund05',
                  component: () =>
                    Promise.all([t.e(400), t.e(534)]).then(t.bind(t, 534)),
                },
                {
                  path: 'fund07',
                  name: 'fund07',
                  component: () => t.e(123).then(t.bind(t, 123)),
                },
                {
                  path: 'fund08',
                  name: 'fund08',
                  component: () =>
                    Promise.all([t.e(400), t.e(251)]).then(t.bind(t, 251)),
                },
                {
                  path: 'fund09',
                  name: 'fund09',
                  component: () =>
                    Promise.all([t.e(400), t.e(76)]).then(t.bind(t, 76)),
                },
                {
                  path: 'fund10',
                  name: 'fund10',
                  component: () =>
                    Promise.all([t.e(400), t.e(548)]).then(t.bind(t, 548)),
                },
                {
                  path: 'edit',
                  name: 'edit',
                  component: () => t.e(662).then(t.bind(t, 662)),
                },
                {
                  path: 'selfEdit',
                  name: 'selfEdit',
                  component: () => t.e(866).then(t.bind(t, 866)),
                },
              ],
            },
          ],
          d = (0, f.aE)({ history: (0, f.Bt)(), routes: s });
        var l = d,
          p = t(558),
          b = t.n(p);
        const h = [
          {
            number: '007677',
            name: '蜂巢添汇(7天)',
            remarks: '10.60',
            notice: '',
            skuId: '1007677',
            status: '1',
          },
          {
            number: '400030',
            name: '东方添益(随时)',
            remarks: '6.62;入8;730',
            notice: '',
            skuId: '106545',
            status: '2',
          },
          {
            number: '006549',
            name: '国金惠盈纯债A',
            remarks: '近一年7.62',
            notice: '',
          },
          {
            number: '485119',
            name: '工银信用(稳)',
            remarks: '5.96;入8;730',
            notice: '',
            skuId: '107337',
            status: '2',
          },
          {
            number: '006980',
            name: '国寿安保(限500)',
            remarks: '6.98;入8;30',
            notice: '',
            skuId: '114237',
            status: '2',
          },
          {
            number: '003547',
            name: '鹏华丰禄(限100)',
            remarks: '5.46;入8;365',
            notice: '',
            skuId: '110067',
            status: '2',
          },
          {
            number: '006760',
            name: '国金惠盈C(30)',
            remarks: '7.77',
            notice: '',
          },
          {
            number: '009604',
            name: '国金惠盈(7-1000)',
            remarks: '',
            notice: '',
          },
          {
            number: '007214',
            name: '国泰惠丰(30天)',
            remarks: '',
            notice: '',
            skuId: '1007214',
            status: '4',
          },
          { number: '000116', name: '嘉实丰益(1)', remarks: '', notice: '' },
          {
            number: '519762',
            name: '交银裕通',
            remarks: '',
            notice: '',
            skuId: '108617',
            status: '4',
          },
          {
            number: '007540',
            name: '华泰保兴安A',
            remarks: '8.95',
            notice: '',
          },
          { number: '017593', name: '汇添富添C', remarks: '8.65', notice: '' },
          {
            number: '008799',
            name: '国金惠安利C',
            remarks: '7.65',
            notice: '',
          },
          { number: '010353', name: '南方崇元A', remarks: '7.19', notice: '' },
        ];
        (window.globalProperties = {
          guokun: h,
          defaultArr: [
            {
              number: '002084',
              name: '新华鑫动力灵活配置混合C',
              remarks: '',
              notice: '1.7,2.08',
            },
            {
              number: '005969',
              name: '创金合信工业周期C',
              remarks: '',
              notice: '1.8,2.2',
            },
            {
              number: '004997',
              name: '广发高端制造股票A',
              remarks: '',
              notice: '1.7,1.82',
            },
            {
              number: '012301',
              name: '易方达核心智造混合',
              remarks: '',
              notice: '0.7,1',
            },
            {
              number: '000536',
              name: '前海开源可转债债券',
              remarks: '',
              notice: '1.2,1.4',
            },
            {
              number: '006482',
              name: '广发可转债债券A',
              remarks: '',
              notice: '1.5,1.64',
            },
            {
              number: '003547',
              name: '鹏华丰禄债券',
              remarks: '',
              notice: '1.06,1.1',
            },
            {
              number: '004010',
              name: '华泰柏瑞鼎利灵活配置混合A',
              remarks: '',
              notice: '1.5,1.7',
            },
          ],
          fundURL:
            'https://1799001811503384.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/fund',
        }),
          (window.$erd = b()()),
          (window.$erdRemove = function (e) {
            b()().uninstall(e);
          });
        const v = (0, r.Ef)(m);
        (v.config.globalProperties.$echarts = i),
          v.use(l).use(o.A).use(i).mount('#app');
      },
    },
    n = {};
  function t(r) {
    var o = n[r];
    if (void 0 !== o) return o.exports;
    var a = (n[r] = { exports: {} });
    return e[r].call(a.exports, a, a.exports, t), a.exports;
  }
  (t.m = e),
    (function () {
      var e = [];
      t.O = function (n, r, o, a) {
        if (!r) {
          var i = 1 / 0;
          for (f = 0; f < e.length; f++) {
            (r = e[f][0]), (o = e[f][1]), (a = e[f][2]);
            for (var u = !0, c = 0; c < r.length; c++)
              (!1 & a || i >= a) &&
              Object.keys(t.O).every(function (e) {
                return t.O[e](r[c]);
              })
                ? r.splice(c--, 1)
                : ((u = !1), a < i && (i = a));
            if (u) {
              e.splice(f--, 1);
              var m = o();
              void 0 !== m && (n = m);
            }
          }
          return n;
        }
        a = a || 0;
        for (var f = e.length; f > 0 && e[f - 1][2] > a; f--) e[f] = e[f - 1];
        e[f] = [r, o, a];
      };
    })(),
    (function () {
      t.n = function (e) {
        var n =
          e && e.__esModule
            ? function () {
                return e['default'];
              }
            : function () {
                return e;
              };
        return t.d(n, { a: n }), n;
      };
    })(),
    (function () {
      t.d = function (e, n) {
        for (var r in n)
          t.o(n, r) &&
            !t.o(e, r) &&
            Object.defineProperty(e, r, { enumerable: !0, get: n[r] });
      };
    })(),
    (function () {
      (t.f = {}),
        (t.e = function (e) {
          return Promise.all(
            Object.keys(t.f).reduce(function (n, r) {
              return t.f[r](e, n), n;
            }, [])
          );
        });
    })(),
    (function () {
      t.u = function (e) {
        return (
          'static/js/' +
          e +
          '.' +
          {
            76: 'db48985f',
            123: 'a3f8d173',
            251: 'eef71630',
            300: 'a86c8401',
            400: '7863232f',
            420: '79298ea6',
            534: '9296f789',
            548: '01e6c55f',
            662: 'b3ce3708',
            682: '6f33c595',
            744: 'e147475d',
            866: '77c47d9c',
            871: 'c7463f24',
            927: '72f8b3f0',
            986: '5b81eea6',
          }[e] +
          '.js'
        );
      };
    })(),
    (function () {
      t.miniCssF = function (e) {
        return (
          'static/css/' +
          e +
          '.' +
          {
            76: 'a440f852',
            123: 'ce38af1f',
            251: 'e88f0b34',
            300: '69d57037',
            420: 'b8681d6b',
            534: 'c99c57c0',
            662: 'cd5b0ca0',
            682: 'c2d609fd',
            744: 'e038ba4b',
            866: '8f2fdf0e',
            871: '5620f1be',
            927: '6f6763c5',
            986: '2e013263',
          }[e] +
          '.css'
        );
      };
    })(),
    (function () {
      t.g = (function () {
        if ('object' === typeof globalThis) return globalThis;
        try {
          return this || new Function('return this')();
        } catch (e) {
          if ('object' === typeof window) return window;
        }
      })();
    })(),
    (function () {
      t.o = function (e, n) {
        return Object.prototype.hasOwnProperty.call(e, n);
      };
    })(),
    (function () {
      var e = {},
        n = 'jijin:';
      t.l = function (r, o, a, i) {
        if (e[r]) e[r].push(o);
        else {
          var u, c;
          if (void 0 !== a)
            for (
              var m = document.getElementsByTagName('script'), f = 0;
              f < m.length;
              f++
            ) {
              var s = m[f];
              if (
                s.getAttribute('src') == r ||
                s.getAttribute('data-webpack') == n + a
              ) {
                u = s;
                break;
              }
            }
          u ||
            ((c = !0),
            (u = document.createElement('script')),
            (u.charset = 'utf-8'),
            (u.timeout = 120),
            t.nc && u.setAttribute('nonce', t.nc),
            u.setAttribute('data-webpack', n + a),
            (u.src = r)),
            (e[r] = [o]);
          var d = function (n, t) {
              (u.onerror = u.onload = null), clearTimeout(l);
              var o = e[r];
              if (
                (delete e[r],
                u.parentNode && u.parentNode.removeChild(u),
                o &&
                  o.forEach(function (e) {
                    return e(t);
                  }),
                n)
              )
                return n(t);
            },
            l = setTimeout(
              d.bind(null, void 0, { type: 'timeout', target: u }),
              12e4
            );
          (u.onerror = d.bind(null, u.onerror)),
            (u.onload = d.bind(null, u.onload)),
            c && document.head.appendChild(u);
        }
      };
    })(),
    (function () {
      t.r = function (e) {
        'undefined' !== typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(e, '__esModule', { value: !0 });
      };
    })(),
    (function () {
      t.p = '';
    })(),
    (function () {
      if ('undefined' !== typeof document) {
        var e = function (e, n, r, o, a) {
            var i = document.createElement('link');
            (i.rel = 'stylesheet'),
              (i.type = 'text/css'),
              t.nc && (i.nonce = t.nc);
            var u = function (t) {
              if (((i.onerror = i.onload = null), 'load' === t.type)) o();
              else {
                var r = t && t.type,
                  u = (t && t.target && t.target.href) || n,
                  c = new Error(
                    'Loading CSS chunk ' +
                      e +
                      ' failed.\n(' +
                      r +
                      ': ' +
                      u +
                      ')'
                  );
                (c.name = 'ChunkLoadError'),
                  (c.code = 'CSS_CHUNK_LOAD_FAILED'),
                  (c.type = r),
                  (c.request = u),
                  i.parentNode && i.parentNode.removeChild(i),
                  a(c);
              }
            };
            return (
              (i.onerror = i.onload = u),
              (i.href = n),
              r
                ? r.parentNode.insertBefore(i, r.nextSibling)
                : document.head.appendChild(i),
              i
            );
          },
          n = function (e, n) {
            for (
              var t = document.getElementsByTagName('link'), r = 0;
              r < t.length;
              r++
            ) {
              var o = t[r],
                a = o.getAttribute('data-href') || o.getAttribute('href');
              if ('stylesheet' === o.rel && (a === e || a === n)) return o;
            }
            var i = document.getElementsByTagName('style');
            for (r = 0; r < i.length; r++) {
              (o = i[r]), (a = o.getAttribute('data-href'));
              if (a === e || a === n) return o;
            }
          },
          r = function (r) {
            return new Promise(function (o, a) {
              var i = t.miniCssF(r),
                u = t.p + i;
              if (n(i, u)) return o();
              e(r, u, null, o, a);
            });
          },
          o = { 524: 0 };
        t.f.miniCss = function (e, n) {
          var t = {
            76: 1,
            123: 1,
            251: 1,
            300: 1,
            420: 1,
            534: 1,
            662: 1,
            682: 1,
            744: 1,
            866: 1,
            871: 1,
            927: 1,
            986: 1,
          };
          o[e]
            ? n.push(o[e])
            : 0 !== o[e] &&
              t[e] &&
              n.push(
                (o[e] = r(e).then(
                  function () {
                    o[e] = 0;
                  },
                  function (n) {
                    throw (delete o[e], n);
                  }
                ))
              );
        };
      }
    })(),
    (function () {
      var e = { 524: 0 };
      (t.f.j = function (n, r) {
        var o = t.o(e, n) ? e[n] : void 0;
        if (0 !== o)
          if (o) r.push(o[2]);
          else {
            var a = new Promise(function (t, r) {
              o = e[n] = [t, r];
            });
            r.push((o[2] = a));
            var i = t.p + t.u(n),
              u = new Error(),
              c = function (r) {
                if (t.o(e, n) && ((o = e[n]), 0 !== o && (e[n] = void 0), o)) {
                  var a = r && ('load' === r.type ? 'missing' : r.type),
                    i = r && r.target && r.target.src;
                  (u.message =
                    'Loading chunk ' + n + ' failed.\n(' + a + ': ' + i + ')'),
                    (u.name = 'ChunkLoadError'),
                    (u.type = a),
                    (u.request = i),
                    o[1](u);
                }
              };
            t.l(i, c, 'chunk-' + n, n);
          }
      }),
        (t.O.j = function (n) {
          return 0 === e[n];
        });
      var n = function (n, r) {
          var o,
            a,
            i = r[0],
            u = r[1],
            c = r[2],
            m = 0;
          if (
            i.some(function (n) {
              return 0 !== e[n];
            })
          ) {
            for (o in u) t.o(u, o) && (t.m[o] = u[o]);
            if (c) var f = c(t);
          }
          for (n && n(r); m < i.length; m++)
            (a = i[m]), t.o(e, a) && e[a] && e[a][0](), (e[a] = 0);
          return t.O(f);
        },
        r = (self['webpackChunkjijin'] = self['webpackChunkjijin'] || []);
      r.forEach(n.bind(null, 0)), (r.push = n.bind(null, r.push.bind(r)));
    })();
  var r = t.O(void 0, [504], function () {
    return t(277);
  });
  r = t.O(r);
})();
