class Register {
    constructor() {
        this.form = document.querySelector(".register-form");
        this.firstNameInput = document.getElementById("first-name-input");
        this.lastNameInput = document.getElementById("last-name-input");
        this.emailInput = document.getElementById("email-input");
        this.phoneInput = document.getElementById("phone-input");
        this.passwordInput = document.getElementById("password-input");
        this.confirmPasswordInput = document.getElementById(
            "confirm-password-input"
        );

        this.firstNameError = document.getElementById("first-name-error");
        this.lastNameError = document.getElementById("last-name-error");
        this.emailError = document.getElementById("email-error");
        this.phoneError = document.getElementById("phone-error");
        this.passwordError = document.getElementById("password-error");
        this.confirmPasswordError = document.getElementById(
            "confirm-password-error"
        );
        this.serverError = document.getElementById("server-error");

        this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    }

    handleSubmit(event) {
        event.preventDefault();

        if (!this.validateFields()) {
            return;
        }

        const firstName = this.firstNameInput.value.trim();
        const lastName = this.lastNameInput.value.trim();
        const email = this.emailInput.value.trim();
        const phoneNumber = this.phoneInput.value.trim();
        const password = this.passwordInput.value.trim();
        const password_confirmation = this.confirmPasswordInput.value.trim();

        fetch(this.form.action, {
            method: this.form.method,
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                phoneNumber,
                password,
                password_confirmation,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.errors) {
                    const errorFields = response.errors;
                    for (const fieldName in errorFields) {
                        const errorMessage = errorFields[fieldName];
                        const input = document.querySelector(
                            `input[name="${fieldName}"]`
                        );
                        this.displayError(
                            input.nextElementSibling,
                            errorMessage[0]
                        );
                    }
                } else if (!response.success) {
                    this.displayError(
                        this.serverError,
                        "Ops, qualcosa è andato storto."
                    );
                } else {
                    window.location.href = "/profile";
                }
            })
            .catch(() => {
                this.displayError(
                    this.serverError,
                    "Ops, qualcosa è andato storto."
                );
            });
    }

    validateFields() {
        const firstName = this.firstNameInput.value.trim();
        const lastName = this.lastNameInput.value.trim();
        const email = this.emailInput.value.trim();
        const phone = this.phoneInput.value.trim();
        const password = this.passwordInput.value.trim();
        const confirmPassword = this.confirmPasswordInput.value.trim();

        let isValid = true;

        this.clearErrors();

        if (firstName === "") {
            this.displayError(this.firstNameError, "Inserisci il tuo nome");
            isValid = false;
        }

        if (lastName === "") {
            this.displayError(this.lastNameError, "Inserisci il tuo cognome");
            isValid = false;
        }

        if (email === "") {
            this.displayError(this.emailError, "Inserisci un indirizzo email");
            isValid = false;
        } else {
            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!emailRegex.test(email)) {
                this.displayError(
                    this.emailError,
                    "Inserisci un indirizzo email valido"
                );
                isValid = false;
            }
        }

        if (phone === "") {
            this.displayError(
                this.phoneError,
                "Inserisci il tuo numero di telefono"
            );
            isValid = false;
        }

        if (password === "") {
            this.displayError(this.passwordError, "Inserisci una password");
            isValid = false;
        } else if (confirmPassword === "") {
            this.displayError(
                this.confirmPasswordError,
                "Inserisci la password di conferma"
            );
            isValid = false;
        } else if (password !== confirmPassword) {
            this.displayError(
                this.confirmPasswordError,
                "Le password non corrispondono"
            );
            isValid = false;
        }

        return isValid;
    }

    displayError(element, message) {
        element.textContent = message;
    }

    clearErrors() {
        this.firstNameError.textContent = "";
        this.lastNameError.textContent = "";
        this.emailError.textContent = "";
        this.phoneError.textContent = "";
        this.passwordError.textContent = "";
        this.confirmPasswordError.textContent = "";
        this.serverError.textContent = "";
    }
}

const register = new Register();
