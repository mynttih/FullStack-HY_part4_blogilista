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

const mostBlogs = (blogs) => {
    const blogsByAuthor = blogs.reduce((result, blog) => {
        if (result.find(count => count.author === blog.author)) {
            result[result.findIndex(count => count.author === blog.author)].blogs += 1
        } else {
            result = result.concat({ 'author': blog.author, 'blogs': 1 })
        }
        return result
    }, [])
    return blogsByAuthor.reduce((count1, count2) => {
        return count1.blogs > count2.blogs ? count1 : count2
    })
}

const mostLikes = (blogs) => {
    const blogsByAuthor = blogs.reduce((result, blog) => {
        if (result.find(count => count.author === blog.author)) {
            result[result.findIndex(count => count.author === blog.author)].likes += blog.likes
        } else {
            result = result.concat({ 'author': blog.author, 'likes': blog.likes })
        }
        return result
    }, [])
    return blogsByAuthor.reduce((count1, count2) => {
        return count1.likes > count2.likes ? count1 : count2
    })
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
    totalLikes,
    mostBlogs,
    mostLikes
}