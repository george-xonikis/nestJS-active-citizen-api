import {PipeTransform, BadRequestException} from '@nestjs/common';

export class UuidValidationPipe implements PipeTransform {

    transform(uuid: string) {
        const uuidV4Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

        if (uuid.length !== 36 || !uuidV4Regex.test(uuid)) {

            throw new BadRequestException(`This is not a valid uuid`, 'invalid_uuid');
        }
        return uuid;
    }

}
