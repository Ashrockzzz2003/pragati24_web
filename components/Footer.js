import React from 'react'
import '../public/footer.css';
import { RiHeartFill } from 'react-icons/ri'
import Link from 'next/link';

export default function Footer() {
    return (
        <footer id="footer">
            <div className="bottom-details">
                <div className="bottom_text">
                    <span className="copyright_text">Copyright &copy; Pragati 2024</span>
                    <span>
                        Made with <RiHeartFill color="red" className="inline" /> by <Link target='_blank' href={"https://ashrockzzz2003.github.io/portfolio/"} className='hover:underline mr-0'>{"Ashwin Narayanan S"}</Link> & <Link target='_blank' href={"https://www.linkedin.com/in/vaisakhkrishnan-k-2358b720b/"} className='hover:underline'>{"Vaisakhkrishnan K"}</Link>.
                    </span>
                    <span className="policy_terms">
                        <Link href="/">Terms & Conditions</Link>
                    </span>
                </div>
            </div>
        </footer>
    );
}