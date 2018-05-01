class UnimplementedError extends Error {
  constructor(msg){
    super(msg);
    this.msg = msg;
    this.name = 'UnimplementedError';
  }
}

module.exports = UnimplementedError;