const operatorPermission = (el, binding) => {
  const value = binding.value

  if (!value) {
    el.parentNode && el.parentNode.removeChild(el)
  }

  const roles = ['admin', 'editor'] // 角色
  if (!roles.includes(value)) {
    el.parentNode && el.parentNode.removeChild(el)
  }
}

export default operatorPermission
