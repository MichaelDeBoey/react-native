import*as e from"../../core/i18n/i18n.js";import*as n from"../../core/root/root.js";import*as o from"../../ui/legacy/legacy.js";const r={rnWelcome:"⚛️ Welcome",showRnWelcome:"Show React Native Welcome panel",debuggerBrandName:"React Native JS Inspector"},a=e.i18n.registerUIStrings("panels/rn_welcome/rn_welcome-legacy-meta.ts",r),t=e.i18n.getLazilyComputedLocalizedString.bind(void 0,a);let i;o.ViewManager.registerViewExtension({location:"panel",id:"rn-welcome",title:t(r.rnWelcome),commandPrompt:t(r.showRnWelcome),order:-10,persistence:"permanent",loadView:async()=>(await async function(){return i||(i=await import("./rn_welcome.js")),i}()).RNWelcome.RNWelcomeImpl.instance({debuggerBrandName:t(r.debuggerBrandName)}),experiment:n.Runtime.ExperimentName.REACT_NATIVE_SPECIFIC_UI});