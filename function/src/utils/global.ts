class GlobalStore {
  private connectResourcePrefixObject;

  setConnectResourcePrefix(awsResourcePrefix: string, prefix: string) {
    if (!this.connectResourcePrefixObject) {
      this.connectResourcePrefixObject = {};
    }
    this.connectResourcePrefixObject[awsResourcePrefix] = prefix;
  }

  getConnectResourcePrefix(awsResourcePrefix: string): string | null {
    if (
      this.connectResourcePrefixObject &&
      Object.prototype.hasOwnProperty.call(this.connectResourcePrefixObject, awsResourcePrefix)
    ) {
      console.log(this.connectResourcePrefixObject);
      return this.connectResourcePrefixObject[awsResourcePrefix];
    }
    return null;
  }
}

// Export a single shared instance
export default new GlobalStore();
