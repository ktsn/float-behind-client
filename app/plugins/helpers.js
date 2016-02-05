export default function install(Vue) {
  Vue.prototype.userIcon = function userIcon(user) {
    return user.iconUrl || '/users/default_image.png';
  };
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}
