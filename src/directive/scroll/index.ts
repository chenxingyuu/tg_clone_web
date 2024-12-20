import type { App, Directive } from 'vue';

type ScrollElement = HTMLElement & { scope: (() => void) | undefined };
type ScrollHandler = (el: Element) => void;
export default {
  install(app: App<Element>) {
    app.directive('scroll', {
      mounted(el, binding) {
        const callback = binding && binding.value;
        let ticking = false;
        if (!callback) return;
        el.scope = () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              callback(el);
              ticking = false;
            });
            ticking = true;
          }
        };
        el.addEventListener('scroll', el.scope, false);
      },
      unmounted(el) {
        if (!el.scope) {
          return;
        }
        el.removeEventListener('scroll', el.scope);
        el.scope = undefined;
      },
    } as Directive<ScrollElement, ScrollHandler>);
  },
};
const scrollDirective: Directive = {
  mounted(el, binding) {
    const callback = binding && binding.value;
    let ticking = false;
    if (!callback) return;
    el.scope = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          callback(el);
          ticking = false;
        });
        ticking = true;
      }
    };
    el.addEventListener('scroll', el.scope, false);
  },
  unmounted(el) {
    if (!el.scope) {
      return;
    }
    el.removeEventListener('scroll', el.scope);
    el.scope = undefined;
  },
};
export function setupScrollDirective(app: App) {
  app.directive('scroll', scrollDirective);
}
