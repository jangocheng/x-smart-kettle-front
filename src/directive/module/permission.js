import store from '@/store'

const checkPermission = function (el, binding) {
  el.style.display = "none"
  const value = binding.value
  const permission = store.state.app.permission
  const have = permission[value]
  if (have || value === "all") {
    el.style.display = '';
  }
};

export default {
  bind: checkPermission,
  update: checkPermission
}
