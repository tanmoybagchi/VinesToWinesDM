import './string-extensions';

export class Result<T= {}> {
  errors: any = {};
  hasErrors = false;
  returnValue: T;

  addError(errorMessage: string, memberName?: string): void {
    if (!String.isNullOrWhitespace(memberName)) {
      const camelCasedMemberName = memberName[0].toLowerCase() + memberName.slice(1);
      this.errors[camelCasedMemberName] = errorMessage;
      this.hasErrors = true;
      return;
    }

    if (!('general' in this.errors)) {
      this.errors.general = {};
    }

    if (errorMessage.includes(' ')) {
      if (!('default' in this.errors.general)) {
        this.errors.general.default = [];
      }
      this.errors.general.default.push(errorMessage);
      this.hasErrors = true;
      return;
    }

    const camelCasedErrorMessage = errorMessage[0].toLowerCase() + errorMessage.slice(1);
    this.errors.general[camelCasedErrorMessage] = true;
    this.hasErrors = true;
  }

  clearErrors() {
    this.errors = {};
    this.hasErrors = false;
  }
}
