import { forwardRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function confirmedValidators(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors.confirmedValidators) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmedValidators: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
