import { Component } from "@angular/core";

//type LineItem = string | { text: string };

export interface AuthResponse {
  success: boolean;
  user: {
    // Add the expected properties of user here
    id: number;
    username: string;
    displayName: string;
    // more fields depending on your user model
  };
}
