with open('subreddit_counts.txt', 'r') as file, open('listofsubreddits.txt', 'w') as outfile:
    for line in file:
        subreddit_name = line.split('\t')[0]
        subreddit_sub = line.split('\t')[1]
        
        if int(subreddit_sub) < 1000:
            break
        
        if int(subreddit_sub) >= 1000:
            outfile.write(subreddit_name + '\n')
            print(subreddit_name)