import { NativeScriptConfig } from '@nativescript/core'

export default {
  id: 'org.nativescript.groceriesng',
  appResourcesPath: 'app/App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
    forceLog: true,
  },
  appPath: 'app',
} as NativeScriptConfig
