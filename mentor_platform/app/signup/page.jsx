"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    // Store role in profiles table
    await supabase.from("profiles").insert([
      {
        id: data.user.id,
        role: role,
      },
    ]);

    alert("Signup successful 🎉");
  };

  return (
    <div className="p-5">
      <h1>Signup</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="mentor">Mentor</option>
      </select><br /><br />

      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}