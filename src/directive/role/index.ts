import { DirectiveBinding } from 'vue';
import { useUserStore } from '@/store';

function checkRole(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;
  const userStore = useUserStore();
  const { roles } = userStore;

  if (Array.isArray(value)) {
    if (value.length > 0) {
      const hasRole = value.some((requiredRole) =>
        roles.some((userRole) => userRole === requiredRole)
      );

      if (!hasRole && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
  } else {
    throw new Error(`need roles! Like v-role="['admin', 'staff']"`);
  }
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkRole(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkRole(el, binding);
  },
};
