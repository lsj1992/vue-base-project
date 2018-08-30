const banner = {
  namespaced: true,
  state: {
    selectedBanner: 0, // 添加banner的时候用来判断选中的banner的id
    selectedBannerUrl: ''
  },
  getters: {
    getSelectedBanner: state => state.selectedBanner,
    getSelectedBannerUrl: state => state.selectedBannerUrl
  },
  mutations: {
    SET_SELECTED_BANNER: (state, select) => {
      state.selectedBanner = select
    },
    SET_SELECTED_BANNERURL: (state, url) => {
      state.selectedBannerUrl = url
    }
  },
  actions: {}
}

export default banner
