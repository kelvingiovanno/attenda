import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsEmailUniqueValidator } from '../providers/is-email-unique-validator';

export function IsEmailUnique(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'IsEmailUnique',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: IsEmailUniqueValidator,
        });
    };
}
