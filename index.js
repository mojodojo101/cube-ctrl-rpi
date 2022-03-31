#!/usr/bin/env node

console.log("HELLO");

// Import the functions you need from the SDKs you need
import tracer from "dd-trace";
import { signIn, signOut} from "./src/auth.js";
import {runapp} from "./src/firebase_invokers.js";
import process from 'process';

const email=process.env.CUBE_EMAIL;
const password=process.env.CUBE_PASS;

runapp(signIn,email,password);

