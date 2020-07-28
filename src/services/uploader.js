import request from './request';

export default class Uploader {
	onUploadProgressHandle() {}
	constructor(fileList = []) {
		this.fileList = fileList;
	}
	addFile(file) {
		this.fileList.push(file);
	}
	addFiles(fileList) {
		this.fileList = [].concat(this.fileList, fileList);
	}
	clear() {
		this.fileList = [];
	}
	onUploadProgress(handle) {
		if (typeof handle == 'function') {
			this.onUploadProgressHandle = handle;
		}
	}
	async upload() {
		const formData = new FormData();
		this.fileList.forEach((file) => {
			formData.append('file[]', file);
		});
		return await request.post('/wx/upload', formData, {
			onUploadProgress: (progressEvent) => {
				const percentCompleted = Math.round(progressEvent.loaded * 100 / progressEvent.total);
				this.onUploadProgressHandle(percentCompleted);
			}
		});
	}
}