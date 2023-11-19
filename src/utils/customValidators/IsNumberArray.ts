import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsNumberArray implements ValidatorConstraintInterface {
  validate(array: any[]) {
    return array.every((element) => typeof element === 'number');
  }
}
