class Progress {
  constructor(threads, downloadSize, options = {}) {
    this.threads = threads;
    this.downloadSize = downloadSize;
    this.options = options;
    this.timeStamp = Date.now();
  }

  async exec() {
    if (!this.options.onProgress) {
      return Promise.resolve();
    }

    let progress = {
      time: Date.now() - this.timeStamp,
      total: {downloaded: 0, total: this.downloadSize},
      threads: []
    };
    this.threads.forEach(thd => {
      progress.threads.push({
        position: thd.position,
        start: thd.start,
        end: thd.end,
        connection: thd.connection
      });
      progress.total.downloaded += (thd.position - thd.start);
    });
    progress.total.remaining = progress.total.total - progress.total.downloaded;

    this.options.onProgress(progress);
    return Promise.resolve();
  }
}

module.exports = Progress;