import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsDayOfWeek implements ValidatorConstraintInterface {
  validate(day: number) {
    return day >= 0 && day <= 6;
  }
}
