import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator'
import { isAddress } from 'ethers'

@ValidatorConstraint({ async: false })
export class IsEthAddressConstraint implements ValidatorConstraintInterface {
  validate(address: string) {
    return isAddress(address)
  }

  defaultMessage(_args: ValidationArguments) {
    return 'Invalid Ethereum wallet address!'
  }
}

export function IsEthAddress(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEthAddressConstraint,
    })
  }
}
