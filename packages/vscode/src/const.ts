import * as vscode from 'vscode'
export const languageId = 'likec4'
export const extensionName = 'likec4'
export const extensionTitle = 'LikeC4'
export const cmdReady = `${extensionName}.ready` as const
export const cmdOpenPreview = `${extensionName}.open-preview` as const
export const cmdRebuild = `${extensionName}.rebuild` as const
export const cmdPreviewContextOpenSource = `${extensionName}.preview-context-open-source` as const
export const cmdLocate = `${extensionName}.locate` as const

export const fileExtensions = ['.c4', '.likec4', '.like-c4'] as const

export const globPattern = '**/*.{c4,likec4,like-c4}'

// Application insights key (also known as instrumentation key)
export const TelemetryConnectionString =
  'InstrumentationKey=36d9aa84-b503-45ea-ae34-b236e4f83bea;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/;LiveEndpoint=https://westeurope.livediagnostics.monitor.azure.com/;ApplicationId=376f93d7-2977-4989-a2e7-d21b20b4984b' as const

export const isWebUi = () => vscode.env.uiKind === vscode.UIKind.Web
export const isVirtual = () => vscode.workspace.workspaceFolders?.every(f => f.uri.scheme !== 'file') || false

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: string | undefined
    }
  }
}

// Replaced by esbuild define
export const isProd = process.env.NODE_ENV === 'production'
export const isDev = process.env.NODE_ENV !== 'production'
