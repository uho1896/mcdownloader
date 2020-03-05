class RequestCanceller {
	constructor(srcList) {
		this.srcList = srcList;
	}

	exec() {
		this.srcList.forEach(s => {
			s.cancel && s.cancel();
		});
	}
}

module.exports = RequestCanceller;