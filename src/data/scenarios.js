export const scenarios = [
    {
        id: 'bank_scam',
        type: 'scam',
        isScam: true,
        title: 'Bank of America High Interest Offer',
        description: 'You receive an exclusive offer for a high-yield savings account.',
        initialStep: 'start',
        steps: {
            start: {
                content: {
                    type: 'email',
                    sender: 'Bank of America <promo@bank-of-america-secure-offers.com>',
                    subject: 'Exclusive: 10% APY Savings Account Offer',
                    body: 'Dear Valued Customer, You have been selected for our Diamond Tier Savings account with a guaranteed 10% APY. This offer expires in 48 hours. Link your current account now to transfer funds and lock in this rate.'
                },
                options: [
                    { label: 'Click the link to claim the offer', next: 'fake_site', outcome: 'neutral' },
                    { label: 'Check the sender\'s email address', next: 'inspect_sender', outcome: 'neutral' },
                    { label: 'Reply and ask for more details', next: 'reply_scammer', outcome: 'neutral' },
                    { label: 'Log in to your real banking app to check', next: 'safe_check', outcome: 'safe' }
                ]
            },
            inspect_sender: {
                content: {
                    type: 'info',
                    text: 'You hover over the sender name. The address is "promo@bank-of-america-secure-offers.com". Real Bank of America emails usually come from "@bankofamerica.com" or "@emcom.bankofamerica.com".'
                },
                options: [
                    { label: 'It says "Bank of America" so it must be real. Click link.', next: 'fake_site', outcome: 'neutral' },
                    { label: 'Google the domain "bank-of-america-secure-offers.com"', next: 'google_domain', outcome: 'neutral' },
                    { label: 'Mark as Spam and Delete', next: 'safe_end', outcome: 'safe' },
                    { label: 'Forward to a friend to ask', next: 'friend_advice', outcome: 'neutral' }
                ]
            },
            friend_advice: {
                content: {
                    type: 'info',
                    text: 'Your friend says: "That looks super fake. 10% APY is impossible right now. And look at that email address!"'
                },
                options: [
                    { label: 'You are right. Delete it.', next: 'safe_end', outcome: 'safe' },
                    { label: 'I\'ll click just to see.', next: 'fake_site', outcome: 'neutral' },
                    { label: 'Reply to them to be sure.', next: 'reply_scammer', outcome: 'neutral' },
                    { label: 'Ignore friend, I want the money.', next: 'fake_site', outcome: 'neutral' }
                ]
            },
            google_domain: {
                content: {
                    type: 'web',
                    url: 'www.google.com',
                    headline: 'Search Results',
                    body: 'No official results found for "bank-of-america-secure-offers.com". Several forums discuss "fake bank domain scams".'
                },
                options: [
                    { label: 'Ignore the results, 10% is too good to miss.', next: 'fake_site', outcome: 'neutral' },
                    { label: 'Close the email immediately.', next: 'safe_end', outcome: 'safe' },
                    { label: 'Reply to the email asking if they are legit.', next: 'reply_scammer', outcome: 'neutral' },
                    { label: 'Click the link just to see what it looks like.', next: 'fake_site', outcome: 'neutral' }
                ]
            },
            reply_scammer: {
                content: {
                    type: 'email',
                    sender: 'Bank of America Support <support@bank-of-america-secure-offers.com>',
                    subject: 'Re: Exclusive: 10% APY Savings Account Offer',
                    body: 'Yes, this is a legitimate limited-time offer for our best customers. We cannot hold this spot for long. Please complete the registration immediately or we will give the spot to another customer.'
                },
                options: [
                    { label: 'Okay, I will sign up now.', next: 'fake_site', outcome: 'neutral' },
                    { label: 'Why is there so much pressure?', next: 'pressure_response', outcome: 'neutral' },
                    { label: 'Call the number in the email signature', next: 'fake_call', outcome: 'neutral' },
                    { label: 'Stop responding.', next: 'safe_end', outcome: 'safe' }
                ]
            },
            pressure_response: {
                content: {
                    type: 'email',
                    sender: 'Bank of America Support',
                    body: 'We have high demand. If you do not want the offer, please let us know so we can give it to the next person on the waitlist. You have 1 hour remaining.'
                },
                options: [
                    { label: 'I don\'t want to miss out. Sign up.', next: 'fake_site', outcome: 'neutral' },
                    { label: 'This is unprofessional. Block.', next: 'safe_end', outcome: 'safe' },
                    { label: 'Call them.', next: 'fake_call', outcome: 'neutral' },
                    { label: 'Check real app.', next: 'safe_check', outcome: 'safe' }
                ]
            },
            fake_call: {
                content: {
                    type: 'phone',
                    caller: 'Bank Support (Fake)',
                    audio_text: '"Bank of America Secure Offers Department. Please provide your account number to verify eligibility."'
                },
                options: [
                    { label: 'Give account number', next: 'fail_login', outcome: 'fail' },
                    { label: 'Hang up.', next: 'safe_end', outcome: 'safe' },
                    { label: 'Ask for their name and ID', next: 'pressure_response', outcome: 'neutral' },
                    { label: 'Say "I will go to a branch".', next: 'safe_check', outcome: 'safe' }
                ]
            },
            fake_site: {
                content: {
                    type: 'web',
                    url: 'www.bank-of-america-secure-offers.com/login',
                    headline: 'Bank of America - Secure Login',
                    body: 'Please sign in with your Online ID and Passcode to claim your 10% APY offer.',
                    input: 'Username/Password fields visible'
                },
                options: [
                    { label: 'Enter your Username and Password', next: 'fail_login', outcome: 'fail' },
                    { label: 'Click "Forgot Password" to test it', next: 'broken_link', outcome: 'neutral' },
                    { label: 'Check the URL bar carefully', next: 'inspect_url', outcome: 'neutral' },
                    { label: 'Close the tab', next: 'safe_end', outcome: 'safe' }
                ]
            },
            broken_link: {
                content: {
                    type: 'info',
                    text: 'You click "Forgot Password" but nothing happens. Or it just reloads the page. Real sites have working links.'
                },
                options: [
                    { label: 'Must be a glitch. Login anyway.', next: 'fail_login', outcome: 'fail' },
                    { label: 'Fake site! Close it.', next: 'safe_end', outcome: 'safe' },
                    { label: 'Try another link.', next: 'inspect_url', outcome: 'neutral' },
                    { label: 'Report phishing.', next: 'safe_report', outcome: 'safe' }
                ]
            },
            inspect_url: {
                content: {
                    type: 'info',
                    text: 'The URL is "bank-of-america-secure-offers.com". There is a lock icon, but that just means the connection is encrypted, not that the site is real.'
                },
                options: [
                    { label: 'It has a lock, so it is safe. Login.', next: 'fail_login', outcome: 'fail' },
                    { label: 'This is not the real site. Close it.', next: 'safe_end', outcome: 'safe' },
                    { label: 'Enter fake details to mess with them', next: 'troll_scammer', outcome: 'neutral' },
                    { label: 'Take a screenshot and report it', next: 'safe_report', outcome: 'safe' }
                ]
            },
            troll_scammer: {
                content: {
                    type: 'info',
                    text: 'You enter "User: FakeUser" and "Pass: 12345". The site accepts it and asks for your SSN. It clearly doesn\'t validate credentials.'
                },
                options: [
                    { label: 'Close the tab immediately.', next: 'safe_end', outcome: 'safe' },
                    { label: 'Enter fake SSN too.', next: 'safe_report', outcome: 'safe' },
                    { label: 'Wait, maybe I should use real info?', next: 'fail_login', outcome: 'fail' },
                    { label: 'Laugh and leave.', next: 'safe_end', outcome: 'safe' }
                ]
            },
            safe_report: {
                isEnd: true,
                success: true,
                message: 'You reported the scam.',
                feedback: 'Taking a screenshot and reporting it to the real bank helps them take down the fake site. Great work!'
            },
            fail_login: {
                isEnd: true,
                success: false,
                message: 'You gave away your banking credentials.',
                feedback: 'You entered your real username and password into a fake site. The scammers now have full access to your bank account.'
            },
            safe_end: {
                isEnd: true,
                success: true,
                message: 'You safely ignored the scam.',
                feedback: 'Recognizing the fake domain and the "too good to be true" offer saved you. Real banks don\'t pressure you with 48-hour deadlines via email.'
            },
            safe_check: {
                isEnd: true,
                success: true,
                message: 'You verified through a trusted channel.',
                feedback: 'Excellent! Always go to the official app or website yourself. You would have seen no such offer exists there.'
            }
        }
    },
    {
        id: 'social_security',
        type: 'scam',
        isScam: true,
        title: 'Urgent: Social Security Suspension',
        description: 'You receive a call claiming your Social Security number has been flagged.',
        initialStep: 'start',
        steps: {
            start: {
                content: {
                    type: 'phone',
                    caller: 'Social Security Administration (1-800-772-1213)',
                    audio_text: '"This is the Social Security Administration. Your Social Security number has been flagged for suspicious activity. Call immediately to avoid account suspension."'
                },
                options: [
                    { label: 'Ask for caller\'s employee ID and callback number', next: 'ask_id', outcome: 'neutral' },
                    { label: 'Provide SSN to confirm identity', next: 'fail_ssn', outcome: 'fail' },
                    { label: 'Hang up and call official SSA number', next: 'safe_official', outcome: 'safe' },
                    { label: 'Ignore and block the number', next: 'safe_ignore', outcome: 'safe' }
                ]
            },
            ask_id: {
                content: {
                    type: 'phone',
                    caller: 'Officer Roberts (Fake)',
                    audio_text: '"My badge number is SSA-8921. This is a federal matter. If you do not verify now, we will issue a warrant for your arrest."'
                },
                options: [
                    { label: 'I am scared. I will verify.', next: 'fake_verification', outcome: 'neutral' },
                    { label: 'The SSA does not threaten arrest. Hang up.', next: 'safe_hangup', outcome: 'safe' },
                    { label: 'Ask to speak to a supervisor', next: 'supervisor_fake', outcome: 'neutral' },
                    { label: 'Tell them you are recording the call', next: 'scammer_hangup', outcome: 'safe' }
                ]
            },
            supervisor_fake: {
                content: {
                    type: 'phone',
                    caller: 'Supervisor (Fake)',
                    audio_text: '"This is Supervisor Smith. Officer Roberts is correct. We have a warrant. You must verify immediately on our secure portal."'
                },
                options: [
                    { label: 'Okay, I will verify.', next: 'fake_verification', outcome: 'neutral' },
                    { label: 'This sounds scripted. Hang up.', next: 'safe_hangup', outcome: 'safe' },
                    { label: 'Ask for the warrant number.', next: 'fake_verification', outcome: 'neutral' }, // Loops back to pressure
                    { label: 'Refuse.', next: 'scammer_hangup', outcome: 'safe' }
                ]
            },
            scammer_hangup: {
                isEnd: true,
                success: true,
                message: 'The scammer hung up.',
                feedback: 'Scammers hate being recorded or questioned. As soon as you pushed back, they knew you weren\'t an easy target.'
            },
            fake_verification: {
                content: {
                    type: 'web',
                    url: 'www.ssa-verify-secure-portal.com',
                    headline: 'Social Security Verification',
                    body: 'Please enter your full Social Security Number to revoke the arrest warrant.',
                    input: 'SSN Field'
                },
                options: [
                    { label: 'Enter SSN', next: 'fail_ssn', outcome: 'fail' },
                    { label: 'This website looks fake. Close it.', next: 'safe_close', outcome: 'safe' },
                    { label: 'Enter fake numbers', next: 'troll_scammer', outcome: 'neutral' },
                    { label: 'Call the police', next: 'safe_police', outcome: 'safe' }
                ]
            },
            troll_scammer: {
                content: {
                    type: 'info',
                    text: 'You entered 000-00-0000. The site accepted it. A real government site would validate this.'
                },
                options: [
                    { label: 'It\'s definitely a scam. Close.', next: 'safe_close', outcome: 'safe' },
                    { label: 'Report the site.', next: 'safe_police', outcome: 'safe' },
                    { label: 'Keep entering fake data.', next: 'safe_close', outcome: 'safe' },
                    { label: 'Wait, let me put my real one.', next: 'fail_ssn', outcome: 'fail' }
                ]
            },
            safe_police: {
                isEnd: true,
                success: true,
                message: 'You contacted authorities.',
                feedback: 'Calling the local police (non-emergency) or reporting to the FTC is the right move. They confirmed no warrant exists.'
            },
            fail_ssn: {
                isEnd: true,
                success: false,
                message: 'You gave away your Social Security Number.',
                feedback: 'The SSA will NEVER call to threaten you with arrest or demand your SSN to "unlock" your account. Caller ID can be spoofed.'
            },
            safe_official: {
                isEnd: true,
                success: true,
                message: 'You called the real SSA.',
                feedback: 'Correct. Always hang up and look up the official number yourself (ssa.gov). The real SSA confirmed there was no issue.'
            },
            safe_hangup: {
                isEnd: true,
                success: true,
                message: 'You hung up on a scammer.',
                feedback: 'Good job. Government agencies send letters; they do not call to threaten arrest. Fear is their main weapon.'
            },
            safe_close: {
                isEnd: true,
                success: true,
                message: 'You closed the fake site.',
                feedback: 'The site was a phishing page designed to steal your identity. Closing it was the safe choice.'
            },
            safe_ignore: {
                isEnd: true,
                success: true,
                message: 'You ignored the call.',
                feedback: 'If it\'s important, the SSA will send a letter. Ignoring unsolicited calls is a safe default strategy.'
            }
        }
    },
    {
        id: 'job_offer',
        type: 'scam',
        isScam: true,
        title: 'Remote Data Entry Job',
        description: 'You applied for a job and got an immediate response.',
        initialStep: 'start',
        steps: {
            start: {
                content: {
                    type: 'email',
                    sender: 'Hiring Manager <hr@global-logistics-inc.net>',
                    subject: 'Job Offer: Remote Data Entry Specialist - $35/hr',
                    body: 'We are impressed with your resume. We would like to hire you immediately. No interview needed. You will need a laptop and printer. We will send you a check to purchase them from our vendor.'
                },
                options: [
                    { label: 'Accept the job immediately', next: 'accept_job', outcome: 'neutral' },
                    { label: 'Ask for a video interview first', next: 'ask_interview', outcome: 'neutral' },
                    { label: 'Check the company website', next: 'check_company', outcome: 'neutral' },
                    { label: 'Decline, it sounds suspicious', next: 'safe_decline', outcome: 'safe' }
                ]
            },
            check_company: {
                content: {
                    type: 'web',
                    url: 'www.global-logistics-inc.net',
                    headline: 'Global Logistics Inc.',
                    body: 'The website looks very generic. The "About Us" text has typos. The address listed is a residential house.'
                },
                options: [
                    { label: 'Seems okay, startups are like this.', next: 'accept_job', outcome: 'neutral' },
                    { label: 'This is a fake company. Decline.', next: 'safe_decline', outcome: 'safe' },
                    { label: 'Ask them about the address.', next: 'ask_interview', outcome: 'neutral' },
                    { label: 'Report them.', next: 'safe_decline', outcome: 'safe' }
                ]
            },
            accept_job: {
                content: {
                    type: 'email',
                    sender: 'Hiring Manager',
                    body: 'Great. We are emailing you a check for $2,500. Deposit it via mobile app, keep $500 for your first week, and wire the rest to our equipment vendor to ship your laptop.'
                },
                options: [
                    { label: 'Deposit the check and wire the money', next: 'fail_check', outcome: 'fail' },
                    { label: 'Wait for the check to clear completely', next: 'wait_clear', outcome: 'neutral' },
                    { label: 'Ask why I can\'t buy it myself', next: 'ask_why', outcome: 'neutral' },
                    { label: 'This is a fake check scam. Stop.', next: 'safe_decline', outcome: 'safe' }
                ]
            },
            wait_clear: {
                content: {
                    type: 'info',
                    text: 'You wait. 3 days later, the bank removes the funds and charges you a fee. The check was fake. Good thing you didn\'t send the money.'
                },
                options: [
                    { label: 'Block the scammer.', next: 'safe_decline', outcome: 'safe' },
                    { label: 'Report to bank.', next: 'safe_decline', outcome: 'safe' },
                    { label: 'Email them angrily.', next: 'safe_decline', outcome: 'safe' },
                    { label: 'Try to deposit it again.', next: 'fail_check_bad', outcome: 'fail' } // Double fail?
                ]
            },
            ask_why: {
                content: {
                    type: 'email',
                    sender: 'Hiring Manager',
                    body: 'Our vendor configures the laptop with proprietary software. You must use our vendor. Trust the process.'
                },
                options: [
                    { label: 'Okay, I will do it.', next: 'fail_check', outcome: 'fail' },
                    { label: 'No, I will buy my own.', next: 'safe_decline', outcome: 'safe' },
                    { label: 'This makes no sense. Quit.', next: 'safe_decline', outcome: 'safe' },
                    { label: 'Ask for vendor name.', next: 'check_company', outcome: 'neutral' }
                ]
            },
            ask_interview: {
                content: {
                    type: 'email',
                    sender: 'Hiring Manager',
                    body: 'We are very busy and trust your resume. We communicate via Telegram text only. Please download Telegram and add me.'
                },
                options: [
                    { label: 'Download Telegram and add them', next: 'telegram_chat', outcome: 'neutral' },
                    { label: 'Refuse to use Telegram, ask for Zoom', next: 'refuse_telegram', outcome: 'neutral' },
                    { label: 'This is unprofessional. Quit.', next: 'safe_decline', outcome: 'safe' },
                    { label: 'Look up the company address', next: 'check_company', outcome: 'neutral' }
                ]
            },
            telegram_chat: {
                content: {
                    type: 'social',
                    platform: 'Telegram',
                    sender: 'Hiring Manager',
                    message: 'Welcome. To start, I need your full name, address, and bank account details for direct deposit.'
                },
                options: [
                    { label: 'Give details.', next: 'fail_identity', outcome: 'fail' },
                    { label: 'Ask for contract first.', next: 'refuse_telegram', outcome: 'neutral' },
                    { label: 'Block user.', next: 'safe_decline', outcome: 'safe' },
                    { label: 'Ask "Is this a scam?"', next: 'refuse_telegram', outcome: 'neutral' }
                ]
            },
            refuse_telegram: {
                content: {
                    type: 'email',
                    sender: 'Hiring Manager',
                    body: 'If you cannot follow simple instructions, you are not a fit for this role. Offer rescinded.'
                },
                options: [
                    { label: 'Good riddance.', next: 'safe_decline', outcome: 'safe' },
                    { label: 'Beg for the job.', next: 'telegram_chat', outcome: 'neutral' },
                    { label: 'Report email.', next: 'safe_decline', outcome: 'safe' },
                    { label: 'Reply "You are a scammer".', next: 'safe_decline', outcome: 'safe' }
                ]
            },
            check_address: { // Mapped to check_company logic
                content: {
                    type: 'web',
                    url: 'Google Maps',
                    headline: 'Address Search',
                    body: 'The address provided maps to an empty lot or a residential home, not a corporate office.'
                },
                options: [
                    { label: 'That is suspicious. Decline.', next: 'safe_decline', outcome: 'safe' },
                    { label: 'Maybe they work from home?', next: 'accept_job', outcome: 'neutral' },
                    { label: 'Ask them about it.', next: 'ask_interview', outcome: 'neutral' },
                    { label: 'Ignore.', next: 'safe_decline', outcome: 'safe' }
                ]
            },
            fail_check: {
                isEnd: true,
                success: false,
                message: 'You fell for a Fake Check scam.',
                feedback: 'The check will bounce in a few days, but the money you wired is gone forever. Legitimate companies never send you checks to buy equipment.'
            },
            fail_check_bad: {
                isEnd: true,
                success: false,
                message: 'You deposited a bad check twice.',
                feedback: 'Your bank may now close your account for fraudulent activity. Never force a check that has bounced.'
            },
            fail_identity: {
                isEnd: true,
                success: false,
                message: 'You gave away sensitive personal info.',
                feedback: 'Providing bank details over Telegram to a stranger is dangerous. They can use this for identity theft.'
            },
            safe_decline: {
                isEnd: true,
                success: true,
                message: 'You avoided a fake job.',
                feedback: 'Good instincts. "No interview", "Telegram only", and "We send you a check" are classic signs of an employment scam.'
            }
        }
    },
    {
        id: 'tech_support',
        type: 'scam',
        isScam: true,
        title: 'Virus Alert Popup',
        description: 'A loud alarm starts playing on your computer.',
        initialStep: 'start',
        steps: {
            start: {
                content: {
                    type: 'popup',
                    header: 'WINDOWS DEFENDER ALERT: ZEUS VIRUS DETECTED',
                    body: 'Your computer has been infected. Data is being stolen. Call Microsoft Support immediately: 1-888-555-0192. Do not restart your computer.',
                    audio: 'Loud beeping noise'
                },
                options: [
                    { label: 'Call the number immediately', next: 'call_scammer', outcome: 'neutral' },
                    { label: 'Click the "Scan Now" button', next: 'scan_fake', outcome: 'neutral' },
                    { label: 'Open Task Manager to close the browser', next: 'safe_close', outcome: 'safe' },
                    { label: 'Unplug the internet router', next: 'safe_unplug', outcome: 'safe' }
                ]
            },
            scan_fake: {
                content: {
                    type: 'popup',
                    header: 'SYSTEM SCANNING...',
                    body: 'Scanning files... 128 Threats Found! Critical Error! Your IP address is compromised. Click "Remove All" to fix.',
                    timer: 'Scan complete.'
                },
                options: [
                    { label: 'Click "Remove All"', next: 'fail_malware', outcome: 'fail' },
                    { label: 'This looks fake. Close browser.', next: 'safe_close', outcome: 'safe' },
                    { label: 'Call the support number', next: 'call_scammer', outcome: 'neutral' },
                    { label: 'Ignore and restart', next: 'safe_close', outcome: 'safe' }
                ]
            },
            call_scammer: {
                content: {
                    type: 'phone',
                    caller: 'Microsoft Support (Fake)',
                    audio_text: '"Hello, this is Microsoft. We see hackers on your network. I need to connect remotely to fix it. Please download AnyDesk."'
                },
                options: [
                    { label: 'Download AnyDesk and give access', next: 'fail_remote', outcome: 'fail' },
                    { label: 'Ask for their employee ID', next: 'ask_id', outcome: 'neutral' },
                    { label: 'Hang up. Microsoft doesn\'t call you.', next: 'safe_hangup', outcome: 'safe' },
                    { label: 'Tell them you have a Mac', next: 'troll_mac', outcome: 'neutral' }
                ]
            },
            ask_id: {
                content: {
                    type: 'phone',
                    caller: 'Microsoft Support (Fake)',
                    audio_text: '"My ID is MS-9921. Look, your computer is about to crash. Do you want to lose all your photos? Connect now."'
                },
                options: [
                    { label: 'I don\'t want to lose photos. Connect.', next: 'fail_remote', outcome: 'fail' },
                    { label: 'You are lying. Hang up.', next: 'safe_hangup', outcome: 'safe' },
                    { label: 'Ask for supervisor.', next: 'call_scammer', outcome: 'neutral' }, // Loop
                    { label: 'Say "I will call Microsoft official number".', next: 'safe_hangup', outcome: 'safe' }
                ]
            },
            troll_mac: {
                content: {
                    type: 'phone',
                    caller: 'Microsoft Support (Fake)',
                    audio_text: '"(Silence)... Uh, we support Mac too. Go to the App Store and download AnyDesk."'
                },
                options: [
                    { label: 'You said Windows Defender earlier.', next: 'safe_hangup', outcome: 'safe' },
                    { label: 'Okay, downloading.', next: 'fail_remote', outcome: 'fail' },
                    { label: 'Hang up.', next: 'safe_hangup', outcome: 'safe' },
                    { label: 'Mess with them more.', next: 'safe_hangup', outcome: 'safe' }
                ]
            },
            safe_unplug: {
                isEnd: true,
                success: true,
                message: 'You disconnected the internet.',
                feedback: 'Unplugging stops any data transfer. Then you can safely restart your computer. The popup was just a browser window.'
            },
            fail_remote: {
                isEnd: true,
                success: false,
                message: 'You gave a scammer remote access.',
                feedback: 'They will now steal your files, install keyloggers, or lock your computer with ransomware. Never give remote access to cold callers.'
            },
            fail_malware: {
                isEnd: true,
                success: false,
                message: 'You clicked a malicious link.',
                feedback: 'Fake "Remove Virus" buttons often download real malware. Real antivirus software runs in its own window, not a browser popup.'
            },
            safe_close: {
                isEnd: true,
                success: true,
                message: 'You safely closed the popup.',
                feedback: 'Correct. These popups are just web pages stuck in full screen. Closing the browser (Alt+F4 or Task Manager) solves the problem.'
            },
            safe_hangup: {
                isEnd: true,
                success: true,
                message: 'You hung up on the scammer.',
                feedback: 'Good. Microsoft will never call you unsolicited to fix your computer.'
            }
        }
    },
    {
        id: 'social_legit',
        type: 'legit',
        isScam: false,
        title: 'Friend in Need?',
        description: 'You get a DM from your friend Sarah on Instagram.',
        initialStep: 'start',
        steps: {
            start: {
                content: {
                    type: 'social',
                    platform: 'Instagram',
                    sender: 'Sarah_Jenkins99',
                    message: 'Hey! Are you free right now? I need a huge favor.'
                },
                options: [
                    { label: 'Sure, what do you need?', next: 'ask_favor', outcome: 'neutral' },
                    { label: 'Is this really Sarah?', next: 'verify_identity', outcome: 'neutral' },
                    { label: 'Ignore it, probably hacked.', next: 'ignore_friend', outcome: 'safe' }, // Changed to safe
                    { label: 'Text her real number to check', next: 'text_real', outcome: 'safe' }
                ]
            },
            ignore_friend: {
                isEnd: true,
                success: true,
                message: 'You ignored the message.',
                feedback: 'If you suspect a friend is hacked, ignoring is safe. Better to text them on another platform to confirm.'
            },
            ask_favor: {
                content: {
                    type: 'social',
                    platform: 'Instagram',
                    sender: 'Sarah_Jenkins99',
                    message: 'I\'m locked out of my other account and need someone to receive a code for me. Can I send it to your phone?'
                },
                options: [
                    { label: 'Send me the code', next: 'fail_2fa', outcome: 'fail' },
                    { label: 'That sounds like a scam. No.', next: 'deny_request', outcome: 'safe' },
                    { label: 'Call her to explain', next: 'call_sarah', outcome: 'safe' },
                    { label: 'Ask "What is my dog\'s name?"', next: 'security_question', outcome: 'neutral' }
                ]
            },
            deny_request: {
                isEnd: true,
                success: true,
                message: 'You refused to send the code.',
                feedback: 'Smart. Never share verification codes sent to your phone, even if a "friend" asks.'
            },
            call_sarah: {
                isEnd: true,
                success: true,
                message: 'You called Sarah.',
                feedback: 'She answered and explained she really was locked out, but understood your caution. Calling is the best verification.'
            },
            security_question: {
                content: {
                    type: 'social',
                    platform: 'Instagram',
                    sender: 'Sarah_Jenkins99',
                    message: 'Lol it\'s Buster! Come on, I really need help.'
                },
                options: [
                    { label: 'Okay, she knows the name. Help.', next: 'safe_help', outcome: 'safe' },
                    { label: 'Still suspicious. Call her.', next: 'call_sarah', outcome: 'safe' },
                    { label: 'Send code.', next: 'fail_2fa', outcome: 'fail' }, // Risky if hacked friend knows dog name? But let's say fail for code.
                    { label: 'Ignore.', next: 'ignore_friend', outcome: 'safe' }
                ]
            },
            verify_identity: {
                content: {
                    type: 'social',
                    platform: 'Instagram',
                    sender: 'Sarah_Jenkins99',
                    message: 'Omg yes it\'s me! I\'m just freaking out because my car broke down and my phone is dying. I need to call AAA but I have no service, only wifi.'
                },
                options: [
                    { label: 'Okay, how can I help?', next: 'help_car', outcome: 'neutral' },
                    { label: 'Send me a voice note', next: 'voice_note', outcome: 'neutral' },
                    { label: 'Where are you exactly?', next: 'ask_location', outcome: 'neutral' },
                    { label: 'I\'ll call your mom to help you', next: 'call_mom', outcome: 'safe' }
                ]
            },
            help_car: {
                content: {
                    type: 'social',
                    platform: 'Instagram',
                    sender: 'Sarah_Jenkins99',
                    message: 'Can you please CashApp me $50 for a tow truck? I will pay you back tomorrow.'
                },
                options: [
                    { label: 'Send $50.', next: 'fail_money', outcome: 'fail' }, // Sending money is usually fail in these sims unless verified
                    { label: 'I will call the tow truck for you.', next: 'safe_help', outcome: 'safe' },
                    { label: 'Voice note first.', next: 'voice_note', outcome: 'neutral' },
                    { label: 'No.', next: 'deny_request', outcome: 'safe' }
                ]
            },
            ask_location: {
                content: {
                    type: 'social',
                    platform: 'Instagram',
                    sender: 'Sarah_Jenkins99',
                    message: 'I am at the Shell station on Main St.'
                },
                options: [
                    { label: 'I will drive there.', next: 'safe_pickup', outcome: 'safe' },
                    { label: 'Send money for tow.', next: 'fail_money', outcome: 'fail' },
                    { label: 'Call the station to check.', next: 'safe_help', outcome: 'safe' },
                    { label: 'Ignore.', next: 'ignore_friend', outcome: 'safe' }
                ]
            },
            call_mom: {
                isEnd: true,
                success: true,
                message: 'You called her mom.',
                feedback: 'Her mom confirmed Sarah was indeed having car trouble. You helped without risking your own security.'
            },
            voice_note: {
                content: {
                    type: 'social',
                    platform: 'Instagram',
                    sender: 'Sarah_Jenkins99',
                    message: '(Voice Note): "Hey, seriously, I\'m stuck at the gas station on 5th. Please just call a tow truck for me."'
                },
                options: [
                    { label: 'That is definitely her voice. Help her.', next: 'safe_help', outcome: 'safe' },
                    { label: 'Could be AI voice. Still suspicious.', next: 'call_mom', outcome: 'safe' },
                    { label: 'Ask for money first', next: 'fail_rude', outcome: 'neutral' },
                    { label: 'Go pick her up yourself', next: 'safe_pickup', outcome: 'safe' }
                ]
            },
            fail_rude: {
                isEnd: true,
                success: true, // Not a scam fail, just rude?
                message: 'You were rude, but safe.',
                feedback: 'You asked for money from a friend in distress. Not nice, but you didn\'t get scammed.'
            },
            safe_pickup: {
                isEnd: true,
                success: true,
                message: 'You went to help in person.',
                feedback: 'Going in person (if safe) is a great way to verify. You found Sarah and helped her.'
            },
            fail_money: {
                isEnd: true,
                success: false,
                message: 'You sent money to a potential scammer.',
                feedback: 'Even if it seems real, sending money via CashApp/Zelle is risky. Once sent, it\'s gone. Verify by voice or phone call first.'
            },
            fail_2fa: {
                isEnd: true,
                success: false,
                message: 'You gave away your 2FA code.',
                feedback: 'This is the "Instagram Takeover" scam. The code was actually for YOUR account. Now they have stolen your account.'
            },
            safe_help: {
                isEnd: true,
                success: true,
                message: 'You helped your friend safely.',
                feedback: 'It really was Sarah! By verifying her voice and the specific situation, you confirmed it wasn\'t a bot. Good friend!'
            },
            text_real: {
                isEnd: true,
                success: true,
                message: 'You verified via a second channel.',
                feedback: 'Sarah replied to your text confirming she was indeed stuck. Multi-factor authentication (using a different channel) is the best way to verify.'
            }
        }
    },
    {
        id: 'service_legit',
        type: 'legit',
        isScam: false,
        title: 'Bank Fraud Alert',
        description: 'You receive a text message about a suspicious charge.',
        initialStep: 'start',
        steps: {
            start: {
                content: {
                    type: 'phone', // SMS style
                    caller: 'Chase Fraud Alert (72001)',
                    audio_text: 'Chase Fraud Alert: Did you attempt a charge of $450.00 at WALMART? Reply YES or NO.'
                },
                options: [
                    { label: 'Reply NO', next: 'reply_no', outcome: 'neutral' },
                    { label: 'Reply YES', next: 'reply_yes', outcome: 'neutral' },
                    { label: 'Click the link (if there was one)', next: 'no_link', outcome: 'neutral' },
                    { label: 'Ignore it', next: 'ignore_alert', outcome: 'neutral' }
                ]
            },
            reply_yes: {
                content: {
                    type: 'phone',
                    caller: 'Chase Fraud Alert',
                    audio_text: 'Thank you. The transaction has been approved. If you did not make this purchase, call us immediately at 1-800-935-9935.'
                },
                options: [
                    { label: 'I did not make it! Call them.', next: 'safe_verify', outcome: 'safe' },
                    { label: 'Wait, I misread. Reply NO.', next: 'reply_no', outcome: 'neutral' },
                    { label: 'Ignore.', next: 'ignore_alert', outcome: 'neutral' }, // Risky
                    { label: 'Block number.', next: 'block_legit', outcome: 'neutral' }
                ]
            },
            ignore_alert: {
                isEnd: true,
                success: false, // Ignoring a real fraud alert is bad
                message: 'You ignored a real fraud alert.',
                feedback: 'If you ignore a real alert, the fraudulent charge might go through. Always verify with your bank app.'
            },
            reply_no: {
                content: {
                    type: 'phone',
                    caller: 'Chase Fraud Alert',
                    audio_text: 'Thank you. We have declined the transaction. Your card has been locked. We will send a new card within 3-5 business days. No further action is needed.'
                },
                options: [
                    { label: 'Great, thanks.', next: 'safe_end', outcome: 'safe' },
                    { label: 'Call the number on the back of my card to confirm', next: 'safe_verify', outcome: 'safe' },
                    { label: 'Reply "Can I unlock it now?"', next: 'ask_unlock', outcome: 'neutral' },
                    { label: 'Panic', next: 'panic', outcome: 'neutral' }
                ]
            },
            ask_unlock: {
                content: {
                    type: 'phone',
                    caller: 'Chase Fraud Alert',
                    audio_text: 'To unlock your card, please call our support line. We cannot unlock via text for security.'
                },
                options: [
                    { label: 'Call support.', next: 'safe_verify', outcome: 'safe' },
                    { label: 'Reply "Please unlock".', next: 'safe_end', outcome: 'safe' }, // Dead end, but safe
                    { label: 'Go to bank branch.', next: 'safe_verify', outcome: 'safe' },
                    { label: 'Ignore.', next: 'safe_end', outcome: 'safe' }
                ]
            },
            panic: {
                content: {
                    type: 'info',
                    text: 'You start panicking. You check your bank app and see the transaction is indeed Pending/Declined.'
                },
                options: [
                    { label: 'Call bank.', next: 'safe_verify', outcome: 'safe' },
                    { label: 'Trust the text, do nothing.', next: 'safe_end', outcome: 'safe' },
                    { label: 'Reply STOP.', next: 'reply_stop', outcome: 'neutral' },
                    { label: 'Post on Facebook.', next: 'safe_end', outcome: 'safe' }
                ]
            },
            reply_stop: {
                isEnd: true,
                success: false,
                message: 'You opted out of fraud alerts.',
                feedback: 'Replying STOP to a real bank number disables future alerts. This leaves you vulnerable.'
            },
            no_link: {
                content: {
                    type: 'info',
                    text: 'You look closely. There is NO link in the message. It just asks for a YES/NO reply. This is a good sign of a legitimate alert.'
                },
                options: [
                    { label: 'Reply NO', next: 'reply_no', outcome: 'neutral' },
                    { label: 'Still suspicious. Call the bank directly.', next: 'safe_verify', outcome: 'safe' },
                    { label: 'Block the number', next: 'block_legit', outcome: 'neutral' },
                    { label: 'Reply STOP', next: 'reply_stop', outcome: 'neutral' }
                ]
            },
            safe_verify: {
                isEnd: true,
                success: true,
                message: 'You verified with the bank.',
                feedback: 'The agent confirmed the text was real and the charge was blocked. Calling the official number is always the safest bet.'
            },
            safe_end: {
                isEnd: true,
                success: true,
                message: 'You handled the fraud alert correctly.',
                feedback: 'Real fraud alerts often just ask Yes/No and don\'t demand you click links or log in. You stayed safe.'
            },
            block_legit: {
                isEnd: true,
                success: false, // Technically a fail because you blocked a real alert? Or just neutral? Let's say fail/warning.
                message: 'You blocked real fraud alerts.',
                feedback: 'That was actually Chase. By blocking them, you might miss future alerts. Being cautious is good, but verifying is better than blocking blindly.'
            }
        }
    }
];
