<template>
  <!-- Registration Form -->
  <div
    class="text-white text-center font-bold p-4 rounded"
    v-if="reg_show_alert"
    :class="reg_alert_variant"
  >
    {{ reg_alert_msg }}
  </div>
  <vee-form
    :validation-schema="schema"
    :initial-values="userData"
    @submit="register"
  >
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field
        name="name"
        type="text"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field
        name="age"
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage class="text-red-600" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage class="text-red-600" name="password" />
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field
        name="confirm_password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
      />
      <ErrorMessage class="text-red-600" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="Egypt">Egypt</option>
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="Antarctica">Antarctica</option>
      </vee-field>
      <ErrorMessage class="text-red-600" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field
        name="tos"
        value="1"
        type="checkbox"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <label class="inline-block">Accept terms of service</label>
      <ErrorMessage class="text-red-600" name="tos" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="reg_in_submission"
    >
      Submit
    </button>
  </vee-form>
</template>

<script>
import { auth, usersCollection } from "@/includes/firebase";
import { mapState } from "pinia";
import useUserStore from "@/stores/user";

export default {
  name: "RegisterForm",

  data() {
    return {
      tab: "login",

      schema: {
        name: "required|min:3|max:100|alpha_spaces",
        email: "required|min:5|max:100|email",
        age: "required|min_value:18|max_value:100",
        password: "required|min:6|max:100",
        confirm_password: "password_mismatch:@password",
        country: "required|country_excluded:Antarctica",
        tos: "tos",
      },

      userData: {
        country: "Egypt",
      },

      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: "bg-blue-500",
      reg_alert_msg: "Please wait... Your account is being created.",
    };
  },

  computed: {
    ...mapState(useUserStore, ["userLoggedIn"]),
  },

  methods: {
    async register(values) {
      this.reg_show_alert = true;
      this.reg_in_submission = true;
      this.reg_alert_variant = "bg-blue-500";
      this.reg_alert_msg = "Please wait... Your account is being created.";

      let userCred = null;
      try {
        userCred = await auth.createUserWithEmailAndPassword(
          values.email,
          values.password
        );
      } catch (error) {
        this.reg_in_submission = false;
        this.reg_alert_variant = "bg-red-500";
        this.reg_alert_msg = "An unexpected error occurred. Please try again.";
        return;
      }

      try {
        await usersCollection.add({
          name: values.name,
          email: values.email,
          age: values.age,
          country: values.country,
        });
      } catch (error) {
        this.reg_in_submission = false;
        this.reg_alert_variant = "bg-red-500";
        this.reg_alert_msg = "An unexpected error occurred. Please try again.";
        return;
      }

      this.userLoggedIn = true;

      this.reg_alert_variant = "bg-green-500";
      this.reg_alert_msg = "Your account has been created successfully.";
      console.log(userCred);
    },
  },
};
</script>
