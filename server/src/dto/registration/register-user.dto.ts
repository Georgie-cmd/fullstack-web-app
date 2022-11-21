import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator"
import { Match } from "src/decorators/match.decorator"

export class RegisterUserDto {
    id: number
    
    @IsString({message: 'Field \'First Name\' must include only letters...'})
    @MinLength(2, {message: 'Field \'First Name\' should be at least 2 charachters...'})
    @MaxLength(18, {message: 'Field \'First Name\' can not be more than 18 characters...'})
    first_name: string
    
    @IsString({message: 'Field \'Last Name\' must include only letters...'})
    @MinLength(2, {message: 'Field \'Last Name\' should be at least 2 charachters...'})
    @MaxLength(22, {message: 'Field \'Last Name\' can not be more than 22 characters...'})
    last_name: string

    @IsString({message: 'Role\'s name must include only letters...'})
    @MinLength(2, {message: 'Role\'s name should be at least 2 charachters...'})
    @MaxLength(50, {message: 'Role\'s name can not be more than 50 characters...'})
    role_in_company: string

    @IsEmail()
    @IsString({message: 'Field \'Email\' must be email...'})
    email: string

    @IsString({message: 'Field \'Password\' must include only letters and numbers...'})
    @MinLength(8, {message: 'Field \'Password\' must be at least 8 characters...'})
    @MaxLength(100, {message: 'Field \'Password\' can not be more than 100 characters...'})
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Field \'Password\' must include: 1 Uppercase letter, more than 8 characters and one numeric character...'
    })
    password: string

    @IsString()
    @Match('password', {message: 'The confirmation password does not match the password entered...'})
    password_confirmation: string
}