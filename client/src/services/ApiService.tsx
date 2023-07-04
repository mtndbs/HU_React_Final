import { getToken } from "../auth/TokenManager";
import { Bcard, User } from "./Interfaces";

const serverUrl = "http://localhost:7800/api/";
const cardsUrl = `${serverUrl}cards/`;
const usersUrl = `${serverUrl}users/`;

export async function getCards(): Promise<any | Bcard[]> {
  const res = await fetch(`${cardsUrl}`, {
    // headers: {
    //   authorization: `Bearer ${getToken()}`,
    // },
  });

  return res.json();
}

export async function getUserCards(): Promise<Array<Bcard>> {
  const res = await fetch(`${cardsUrl}my`, {
    headers: {
      authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
}

export async function getCardById(_id: string): Promise<Bcard> {
  const res = await fetch(`${cardsUrl}${_id}`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

export async function addCard(card: Bcard): Promise<Bcard> {
  const res = await fetch(`${cardsUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(card),
  });
  return res.json();
}

export async function deleteCard(_id: string): Promise<any> {
  const res = await fetch(`${cardsUrl}${_id}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${getToken()}`,
    },
  });
  return res;
}

export async function editCard(_id: string, card: Bcard): Promise<Bcard> {
  const res = await fetch(`${cardsUrl}${_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(card),
  });
  return res.json();
}

export async function toggleFavoriteCard(cardId: string): Promise<Bcard> {
  const res = await fetch(`${cardsUrl}${cardId}/favorite`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

// export async function getUserFavoriteCard(): Promise<Array<Bcard>> {

export async function editUser(data: User): Promise<User> {
  const res = await fetch(`${usersUrl}updateMe`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminSetUser(data: User): Promise<User> {
  const res = await fetch(`${usersUrl}adminSet`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminDeleteUser(_id: User): Promise<User> {
  const res = await fetch(`${usersUrl}deleteUser/${_id}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${getToken()}`,
    },
  });
  return res;
}

export async function getUserFavoriteCard(): Promise<any> {
  const res = await fetch(`${cardsUrl}getUserFavoriteCards`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

export async function getUserInfo(): Promise<User> {
  const res = await fetch(`${usersUrl}me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

export async function getAllUsers(): Promise<Array<User>> {
  const res = await fetch(`${usersUrl}allUsers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

export async function signup(user: User): Promise<User> {
  const res = await fetch(`${usersUrl}signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return res.json();
}

export async function login(user: User): Promise<User> {
  const res = await fetch(`${usersUrl}login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return res.json();
}
