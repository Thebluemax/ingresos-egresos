export class Usuario {

  static fromFirebase({ email, nombre, uid }) {
      return new Usuario( uid, email, nombre);
  }

  constructor(
    public uid: string,
    public email: string,
    public nombre: string
  ) {}

}
