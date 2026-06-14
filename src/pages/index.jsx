import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Landing from "./Landing";

import Profile from "./Profile";

import Opportunities from "./Opportunities";

import Executives from "./Executives";

import MyApplications from "./MyApplications";

import MyOpportunities from "./MyOpportunities";

import PostOpportunity from "./PostOpportunity";

import Features from "./Features";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import Login from './Login';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Landing: Landing,
    
    Profile: Profile,
    
    Opportunities: Opportunities,
    
    Executives: Executives,
    
    MyApplications: MyApplications,
    
    MyOpportunities: MyOpportunities,
    
    PostOpportunity: PostOpportunity,
    
    Features: Features,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    if (/\/login$/i.test(location.pathname)) {
        return <Routes><Route path="/login" element={<Login />} /><Route path="/Login" element={<Login />} /></Routes>;
    }

    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Landing" element={<Landing />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/Opportunities" element={<Opportunities />} />
                
                <Route path="/Executives" element={<Executives />} />
                
                <Route path="/MyApplications" element={<MyApplications />} />
                
                <Route path="/MyOpportunities" element={<MyOpportunities />} />
                
                <Route path="/PostOpportunity" element={<PostOpportunity />} />
                
                <Route path="/Features" element={<Features />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}