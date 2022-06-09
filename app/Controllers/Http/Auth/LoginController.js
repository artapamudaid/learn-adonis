'use strict'

const User = use('App/Models/User')
const {validate} = use('Validator')

class LoginController {
    index({ view }) {
        return view.render('auth.login')
    }

    async check({ request, response, session, auth}) {

        const rules = {
            email: 'required',
            password: 'required',
        }

        const messages = {
            'email.required': 'Email Tidak Boleh Kosong!',
            'password.required': 'Password Tidak Boleh Kosong!',
        }

        const validation = await validate(request.all(), rules, messages)

        if(validation.fails()) {
            session.withErrors(validation.messages()).flashExcept(['password'])
            return response.redirect('back')
        }

        const { email, password } = request.all()

        await auth.attempt(email, password)
        return response.route('posts.index')
    }

    async logout({auth, response}) {
        await auth.logout()
        return response.route('login.index')
    }

}

module.exports = LoginController
