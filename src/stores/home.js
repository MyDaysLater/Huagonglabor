import { observable, action, computed, flow } from 'mobx';
// import { fetchRepos } from '../services'

class HomeStore {
  @observable list;
  @observable title;
  @observable repos;
  @computed
  get getList() {
    return this.list;
  }
  @computed
  get getTitle() {
    return this.title;
  }
  @computed
  get getRepos() {
    return this.repos;
  }

  @action
  addItem = item => this.list.push(item);

  @action
  setTitle = title => this.title = title;
  @action
  setRepos = data => this.repos = data;

  fetchRepos = flow(function* githubRepos() {
    // try {
    //   this.repos = yield fetchRepos().then(res => res.data);
    // } catch (error) {
    //   console.log(error)
    // }
  })

  constructor() {
    this.list = []
    this.title = "Home Page"
    this.repos = []
  }
}

export default new HomeStore();