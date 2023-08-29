const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
    if (!req.session.authenticated) {
        res.render('login', {
            message: req.flash('error'), bg: String((Math.floor(Math.random() * 23) + 1)).padStart(2, '0')
        });
    } else {
        res.render('dashboard');
    }
});

const datalog = async (keys, data) => {
    return await fs.readJSON('data.json', 'utf8')
        .then((jsonData) => {
            return jsonData
        })
        .catch((err) => {
            console.error(err);
        });
}

const write_ = async (data) => {
    fs.writeJSON('data.json', data, { spaces: 2 })
        .then(() => {
            console.log('Data has been written to the file.');
        })
        .catch((err) => {
            console.error(err);
        });
}

router.post('/login', (req, res) => {
    const {
        password
    } = req.body;
    const storedHash = '$2a$10$f7kV89C/ha0xZ7nqXvgN5eT9dTsNUy9UzzBCg1TafY2OQsRft36A2';

    bcrypt.compare(password, storedHash, function (err, result) {
        if (err) {
            // Handle bcrypt error
            console.error(err);
            req.flash('error', 'An error occurred');
            res.redirect('/');
        } else {
            if (result) {
                req.session.authenticated = true;
                if (!req.session.path_ || req.session.path_ === '' || req.session.path_ === '/favicon.ico') {
                    req.session.path_ = '/dashboard';
                }
                res.redirect(req.session.path_);
            } else {
                req.flash('error', 'Incorrect password');
                res.redirect('/');
            }
        }
    });
});
router.get('/logout', (req, res) => {
    req.session.destroy();
    if (fs.existsSync('./uploads')) {
        // Delete the folder
        fs.rmSync('./uploads', { recursive: true });
        fs.mkdirSync('./uploads');
        fs.mkdirSync('./uploads/report');
        console.log('Folder renewed successfully.');
    } else {
        console.log('Folder does not exist.');
    }
    res.redirect('/');
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});
router.get('/report', async (req, res) => {
    const data = await datalog()
    const keys = Object.keys(data)
    let a = c = d = 0;
    const count = keys.length
    keys.forEach(key => {
        a += Number(data[key])
    });
    c = ((a*100)-(90*count)).toFixed(1)
    d = parseInt(c*10)
    res.render('report', { data, keys, total: { c, d } });
});
router.get('/new', (req, res) => {
    res.render('new', { message: req.flash('error') });
});
router.post('/delete', async (req, res) => {
    const id = Number(req.body.id)
    console.log(id);
    debugger
    const json = await datalog()
    delete json[id]
    await write_(json)
    res.redirect("/")
});

router.post('/new', async (req, res) => {
    const score = Number(req.body.scoreInput)
    const url = new URL(req.body.urlInput)
    const total = Number(req.body.scoreInput0)
    const ver = req.body.verification
    if (ver == 'on' && score && total && url) {
        if (((score / total) >= 0) && (url.hostname === 'classes.brilliantpala.org' && url.pathname.startsWith('/exams/review/'))) {
            console.log((score / total) <= 1);
            const id = Number(url.pathname.split('/')[3]);
            const credit = score / total
            const json = await datalog()
            json[id] = credit
            write_(json)
            console.log(json, datalog());
            res.sendStatus(200)
        } else {
            req.flash('error', 'Recheck entered score/total & ExamURL');
            res.redirect('/new')
        }

    } else {
        req.flash('error', 'Recheck all inputs and press verify');
        res.redirect('/new')
    }

});

module.exports = router;
