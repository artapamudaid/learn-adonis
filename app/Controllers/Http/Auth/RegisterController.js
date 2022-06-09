'use strict'

const User = use('App/Models/User')
const {validate} = use('Validator')

class RegisterController {
    index({view}){
        return view.render('auth.register')
    }

    async store({request, response, session}) {
        const rules = {
            username: 'required|unique:users',
            email: 'required|unique:users,email',
            password: 'required',
        }

        const messages = {
            'username.required': 'Username Tidak Boleh Kosong!',
            'username.unique': 'Username Sudah Terpakai!',
            'email.required': 'Alamat Email Tidak Boleh Kosong!',
            'email.unique': 'Alamat Email Sudah Terpakai!',
            'password.required': 'Password Tidak Boleh Kosong!',
        }

        const validation = await validate(request.all(), rules, messages)

        if(validation.fails()) {
            session.withErrors(validation.messages()).flashExcept(['password'])
            return response.redirect('back')
        }

        const user = await User.create({
            username: request.input('username'),
            email: request.input('email'),
            password: request.input('password')
        })

        session.flash({ notification: 'Registrasi Berhasil!' })
        return response.route('login.index')
    }
}

module.exports = RegisterController
