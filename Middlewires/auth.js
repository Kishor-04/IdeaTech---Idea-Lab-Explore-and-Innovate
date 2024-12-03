const isLogin = async (req, res, next) => {

    try{
        if(req.session.admin_id){}
        else{
            res.redirect('/');
        }
        next();
    }
    catch (error) {
        console.log(error.message)
    }
}

const isLogout = async (req, res, next) => {

    try{

        if(req.session.admin_id){
            res.redirect('/AdminHomepage');
        }

        next();
    }
    catch (error) {
        console.log(error.message)
    }
}

export default {
    isLogin,
    isLogout
}