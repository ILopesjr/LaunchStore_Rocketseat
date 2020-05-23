const crypto = require("crypto")
const { hash } = require("bcryptjs")
const User = require("../models/User")
const mailer = require("../lib/mailer")

module.exports = {
  loginForm(req,res){
    return res.render("session/login.njk")
  },
  login(req,res){
    req.session.userID = req.user.id
    req.session.userName = req.user.name.split(" ")[0]
    return res.redirect('/users')
  },
  logout(req,res){
      req.session.destroy()
      return res.redirect('/')
  },
  forgotForm(req,res){
     return res.render("session/forgot-password.njk")
  },
  async forgot(req,res){
    const user = req.user

    try {
      // criar token para usuário
      const token = crypto.randomBytes(20).toString("hex")

      // criar expiração
      let now = new Date()

      now = now.setMinutes(now.getMinutes()+ 5) // 5 minutos para expirar o token

      await User.saveUpdate(user.id, {
        reset_token: token,
        reset_token_expires: now
      })

      // enviar e-mail com um link de recuperação de senha
      await mailer.sendMail({
        to: user.email,
        from: 'no-reply@launchstore.com.br',
        subject: 'NO-REPLY: Recuperação de Senha',
        html: `
        <h2>Vamos recuperar o acesso a sua conta?</h2>
        <p> Não precisa se preocupar, basta acessar o link logo abaixo para recuperar sua senha.</p>
        <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
          Recuperar Senha
        </a>
        <p style="font-size: 10 color: #9999"> Essa solicitação de recuperação de senha estará ativa por 5 minutos. </p>
        `
      })

      // Avisar o usuário que o email foi enviado
      return res.render("session/forgot-password.njk", {
        sucess: "E-mail de recuperação enviado! Por favor, verique o e-mail cadastrado."
      })

    } catch (err) {
      console.error(err + " forgot SessionController")
      return res.render("session/forgot-password.njk", {
        user: req.body,
        error: "Estamos com problemas, tente novamente mais tarde."
      })
    }
    
  },
  resetForm(req,res){
    return res.render("session/password-reset", { token:req.query.token }) //(req.query.token? req.query.token : req.body.token)
  },
  async reset(req,res){
    const { password, token } = req.body
    const { user } = req

    try {
      // Novo hash de senha
      const newPassword = await hash(password, 8)

      // Atualizar usuário
      await User.saveUpdate(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token_expires: ""
      })

      // Confirmar atualização
      return res.render("session/login", {
        user: req.body,
        sucess: "Senha Atualizada! Faça o seu login."
      })

    } catch (err) {
      console.error(err + " reset SessionController")
      return res.render("session/password-reset.njk", {
        user: req.body,
        token,
        error: "Estamos com problemas, tente novamente mais tarde."
      })
    }
  }

}