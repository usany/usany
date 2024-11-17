import { useState, useEffect } from 'react'

interface Props {
    title: string
}

const PageTitle = ({ title }: {title: string}) => {
    return (
        <div className='flex text-2xl p-5'>
            {title}
        </div>
    )
}

export default PageTitle