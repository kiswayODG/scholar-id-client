import React, { ReactNode } from 'react';
import { Header } from './menus/Header';
import { Footer } from './menus/Footer';
interface LayoutProps {
    className?: string;
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ className = '', children }) => {
    return (
        <div className={className}>
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;
