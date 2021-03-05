const routes = require('next-routes')

                                                    // Name   Page      Pattern
module.exports = routes()                           // ----   ----      -----
.add('reset-password', '/reset-password/:slug')                         // blog   blog      /blog/:slug
