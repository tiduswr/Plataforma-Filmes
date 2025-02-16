package com.tiduswr.movies_server.validators;

import java.util.Arrays;

import org.passay.CharacterRule;
import org.passay.EnglishCharacterData;
import org.passay.LengthRule;
import org.passay.PasswordData;
import org.passay.PasswordValidator;
import org.passay.PropertiesMessageResolver;
import org.passay.RuleResult;
import org.passay.WhitespaceRule;
import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class PasswordConstraintsValidator implements ConstraintValidator<Password, String> {

    private PropertiesMessageResolver propertiesMessageResolver;

    @Override
    public boolean isValid(String password, ConstraintValidatorContext constraintValidatorContext) {

        PasswordValidator passwordValidator = new PasswordValidator(
                propertiesMessageResolver,
                Arrays.asList(
                        //Length rule. Min 7 max 128 characters
                        new LengthRule(7, 128),

                        //At least one upper case letter
                        new CharacterRule(EnglishCharacterData.UpperCase, 1),

                        //At least one lower case letter
                        new CharacterRule(EnglishCharacterData.LowerCase, 1),

                        //At least one number
                        new CharacterRule(EnglishCharacterData.Digit, 1),

                        //At least one special characters
                        new CharacterRule(EnglishCharacterData.Special, 1),

                        new WhitespaceRule()


                )
        );

        RuleResult result = passwordValidator.validate(new PasswordData(password));

        if (result.isValid()) {

            return true;

        }
        
        //Sending one message each time failed validation. 
        constraintValidatorContext.buildConstraintViolationWithTemplate(passwordValidator.getMessages(result).stream().findFirst().get())
                .addConstraintViolation()
                .disableDefaultConstraintViolation();
        
        return false;

    }
}
