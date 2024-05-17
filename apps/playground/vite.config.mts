import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import { vanillaExtractPlugin as vanillaExtractEsbuildPlugin } from '@vanilla-extract/esbuild-plugin'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { defineConfig, mergeConfig, type AliasOptions, type UserConfig, type UserConfigFnObject } from 'vite'

const root = dirname(__filename)

const alias = {
  '#monaco/bootstrap': resolve('src/monaco/bootstrap.ts'),
  '#monaco/config': resolve('src/monaco/config.ts'),
  '@likec4/core': resolve('../../packages/core/src/index.ts'),
  '@likec4/language-server/protocol': resolve('../../packages/language-server/src/protocol.ts'),
  '@likec4/language-server/browser': resolve('../../packages/language-server/src/browser/index.ts'),
  '@likec4/language-server': resolve('../../packages/language-server/src/index.ts'),
  '@likec4/layouts': resolve('../../packages/layouts/src/index.ts'),
  '@likec4/diagram': resolve('../../packages/diagram/src/index.ts')
} satisfies AliasOptions

const baseConfig: UserConfigFnObject = () => {
  return {
    root,
    resolve: {
      dedupe: [
        'react',
        // 'vscode',
        'react-dom',
        'react-dom/client'
      ],
      alias
    },
    css: {
      modules: {
        localsConvention: 'camelCase'
      },
      postcss: {}
    },
    build: {
      cssCodeSplit: false
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'langium/lsp',
        'vscode-languageserver/browser',
        'langium',
        'ufo',
        'vscode-languageserver',
        'strip-indent',
        'vscode-uri',
        'string-hash',
        '@dagrejs/graphlib',
        'rambdax'
      ],
      esbuildOptions: {
        plugins: [
          importMetaUrlPlugin,
          vanillaExtractEsbuildPlugin({
            runtime: true
          })
        ]
      }
    },
    plugins: []
  }
}

export default defineConfig((env) => {
  switch (true) {
    // Pre-build for production
    // Workaround for incompatibility between vanilla-extract and monaco-editor
    case env.command === 'build' && env.mode === 'pre':
      return mergeConfig<UserConfig, UserConfig>(baseConfig(env), {
        define: {
          'process.env.NODE_ENV': JSON.stringify('production')
        },
        mode: 'production',
        build: {
          cssCodeSplit: false,
          cssMinify: false,
          minify: false,
          target: 'esnext',
          outDir: resolve('prebuild'),
          emptyOutDir: true,
          commonjsOptions: {
            transformMixedEsModules: true,
            esmExternals: true
          },
          rollupOptions: {
            output: {
              preserveModules: true,
              preserveModulesRoot: resolve('src')
            },
            makeAbsoluteExternalsRelative: 'ifRelativeSource',
            external: [
              'react',
              'react/jsx-runtime',
              'react-dom',
              'react-dom/client',
              '@typefox/monaco-editor-react',
              'monaco-editor',
              'monaco-editor-wrapper',
              'monaco-languageclient',
              'framer-motion',
              'esm-env',
              '#monaco/bootstrap',
              '#monaco/config',
              /hpcc-js/,
              // /node_modules\/react/,
              // /node_modules\/react/,
              /node_modules.*vscode/,
              // /node_modules.*framer-motion/,
              /node_modules.*monaco/
            ]
          },
          lib: {
            entry: {
              // main: resolve('src/main.tsx')
              main: 'src/main.tsx'
            },
            fileName: (format, entryname) => `${entryname}.mjs`,
            formats: ['es']
          }
        },
        plugins: [
          vanillaExtractPlugin({
            identifiers: 'short',
          }),
          TanStackRouterVite({
            routeFileIgnorePattern: '.css.ts',
            generatedRouteTree: resolve('src/routeTree.gen.ts'),
            routesDirectory: resolve('src/routes'),
            quoteStyle: 'single'
          }),
          react({
            // jsxRuntime: 'classic'
          })
        ]
      })
    case env.command === 'build':
      return mergeConfig<UserConfig, UserConfig>(baseConfig(env), {
        define: {
          'process.env.NODE_ENV': JSON.stringify('production')
        },
        mode: 'production',
        resolve: {
          alias: {
            '/src/style.css': resolve('prebuild/style.css'),
            '/src/main': resolve('prebuild/main.mjs')
          }
        },
        build: {
          copyPublicDir: true,
          modulePreload: false,
          commonjsOptions: {
            transformMixedEsModules: true,
            esmExternals: true
          },
          target: 'modules',
          rollupOptions: {
            output: {
              compact: true,
              manualChunks: (id) => {
                if (id.includes('node_modules')) {
                  if (id.includes('/monaco') || id.includes('/vscode/')) {
                    return 'monaco'
                  }
                }
              }
            }
          }
        },
        plugins: [
          react({
            // jsxRuntime: 'classic'
          })
        ]
      })
    default:
      return mergeConfig(baseConfig(env), {
        plugins: [
          vanillaExtractPlugin({}),
          TanStackRouterVite({
            routeFileIgnorePattern: '.css.ts',
            generatedRouteTree: resolve('src/routeTree.gen.ts'),
            routesDirectory: resolve('src/routes'),
            quoteStyle: 'single'
          }),
          react({})
        ]
      })
  }
})

// export default defineConfig(({ mode }) => {
//   const isWatchDev = mode === 'watch-dev'
//   const isDev = isWatchDev || mode === 'development'
//   return {
//     css: {
//       modules: {
//         localsConvention: 'camelCase'
//       },
//       postcss: {}
//     },
//     root: resolve('.'),
//     resolve: {
//       dedupe: [
//         'react',
//         // 'vscode',
//         'react-dom',
//         'react-dom/client'
//       ],
//       alias
//     },
//     optimizeDeps: {
//       include: [
//         'react',
//         'react-dom',
//         'langium/lsp',
//         'vscode-languageserver/browser',
//         'langium',
//         'ufo',
//         'vscode-languageserver',
//         'strip-indent',
//         'vscode-uri',
//         'string-hash',
//         '@dagrejs/graphlib',
//         'rambdax'
//       ],
//       esbuildOptions: {
//         plugins: [
//           importMetaUrlPlugin,
//           vanillaExtractEsbuildPlugin({
//             runtime: true
//           })
//         ]
//       }
//     },
//     ssr: {
//       target: 'webworker'
//     },
//     build: {
//       copyPublicDir: true,
//       emptyOutDir: true,
//       commonjsOptions: {
//         transformMixedEsModules: true,
//         esmExternals: true
//       },
//       rollupOptions: {
//         // external: [
//         //   /vscode/
//         // ],
//         // plugins: [
//         //   vanillaExtractRollupPlugin({
//         //     esbuildOptions: {
//         //       loader: {
//         //         '.css': 'empty'
//         //       }
//         //     }
//         //   })
//         // ],
//         output: {
//           manualChunks: (id) => {
//             if (id.includes('node_modules')) {
//               return id.includes('vscode') || id.includes('monaco') ? 'vscode' : 'vendor'
//             }
//           }
//         }
//       }
//       // cssCodeSplit: false
//     },
//     plugins: [
//       vanillaExtractPlugin({
//         unstable_mode: 'transform'
//       }),
//       react(),
//       TanStackRouterVite({
//         routeFileIgnorePattern: '.css.ts',
//         generatedRouteTree: resolve('src/routeTree.gen.ts'),
//         routesDirectory: resolve('src/routes'),
//         quoteStyle: 'single'
//       })
//     ]
//   }
// })