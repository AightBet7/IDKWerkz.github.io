// ==========================
// IDK Werkz Account System
// ==========================

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const forgotPassword = document.getElementById("forgot-password");


// ==========================
// CREATE ACCOUNT
// ==========================

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("signup-confirm").value;

    if (password !== confirmPassword) {
        alert("Your passwords do not match.");
        return;
    }

    try {
        // Check whether the name is already being used
        const { data: existingProfile, error: profileError } =
            await supabaseClient
                .from("profiles")
                .select("name")
                .eq("name", name)
                .maybeSingle();

        if (profileError) {
            throw profileError;
        }

        if (existingProfile) {
            alert("That name is already taken.");
            return;
        }

        // Create the secure authentication account
       const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
    options: {
        data: {
            name: name
        }
    }
});

        if (error) {
            throw error;
        }

        // Create the customer's profile
       
        alert(
            "Account created! Check your email to verify your IDK Werkz account."
        );

        signupForm.reset();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});
// ==========================
// LOG IN
// ==========================

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("login-name").value.trim();
    const password = document.getElementById("login-password").value;

    if (!name || !password) {
        alert("Please enter your name and password.");
        return;
    }

    try {
        // Securely find the email associated with the name
        const { data: email, error: lookupError } =
            await supabaseClient.rpc("get_login_email", {
                login_name: name
            });

        if (lookupError) {
            throw lookupError;
        }

        if (!email) {
            alert("Account not found.");
            return;
        }

        // Sign in through Supabase
        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (error) {
            alert("Incorrect name or password.");
            return;
        }

        alert("Welcome back, " + name + "! 🐺");

        // We'll replace this with the customer's account page later
        window.location.href = "account.html";

    } catch (error) {
        console.error(error);
        alert("Something went wrong while logging in.");
    }
});
// ==========================
// FORGOT PASSWORD
// ==========================

forgotPassword.addEventListener("click", async () => {

    const email = prompt(
        "Enter the email address connected to your IDK Werkz account:"
    );

    if (!email) {
        return;
    }

    const cleanEmail = email.trim();

    try {
        // Send a one-time password to the email
        const { error } = await supabaseClient.auth.signInWithOtp({
            email: cleanEmail,
            options: {
                shouldCreateUser: false
            }
        });

        if (error) {
            throw error;
        }

        const otp = prompt(
            "Check your email for your OTP and enter the code here:"
        );

        if (!otp) {
            return;
        }

        // Verify the OTP
        const { error: verifyError } =
            await supabaseClient.auth.verifyOtp({
                email: cleanEmail,
                token: otp.trim(),
                type: "email"
            });

        if (verifyError) {
            throw verifyError;
        }

        const newPassword = prompt(
            "Enter your new account password:"
        );

        if (!newPassword) {
            return;
        }

        const confirmPassword = prompt(
            "Confirm your new account password:"
        );

        if (newPassword !== confirmPassword) {
            alert("The passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            alert("Your password must be at least 6 characters.");
            return;
        }

        // Change the password
        const { error: updateError } =
            await supabaseClient.auth.updateUser({
                password: newPassword
            });

        if (updateError) {
            throw updateError;
        }

        alert("Your password has been changed successfully! 🐺");

    } catch (error) {
        console.error(error);
        alert("Password recovery failed: " + error.message);
    }
   });
