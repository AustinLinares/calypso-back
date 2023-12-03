import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsShortDate implements ValidatorConstraintInterface {
  validate(text: string) {
    const timeRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

    return timeRegex.test(text);
  }
}
