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
	async upload(appid) {
        const formData = new FormData();
        formData.append('appid', appid);
		this.fileList.forEach((file) => {
			formData.append('file[]', file);
        });
        
        // const params={
        //     appid,
        //     formData,
        // }
		return await request.post('/wx/upload-cart', formData,{
			onUploadProgress: (progressEvent) => {
				const percentCompleted = Math.round(progressEvent.loaded * 100 / progressEvent.total);
				this.onUploadProgressHandle(percentCompleted);
			}
		});
	}
}