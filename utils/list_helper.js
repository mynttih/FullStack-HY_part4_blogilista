const dummy = (blogs) => {
    return 1
}

const favoriteBlog = (blogs) => {
    const favorite = blogs.reduce((blog1, blog2) => {
        return blog1.likes > blog2.likes ? blog1 : blog2
    })
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

const totalLikes = (blogs) => {
    const total = blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)
    return total
}

module.exports = {
    dummy,
    favoriteBlog,
    totalLikes
}